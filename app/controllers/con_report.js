var crud = require("../model/crud");
var path = require("path");
exports.getReport = (req, res) => {
  let offset = req.query.page * 10;
  let limit = 10; // 일단 10개로 고정

  let totalcount = 0;

  let countSql = "SELECT COUNT(*) FROM report";

  let countInfo = {
    dbName: "endangered",
    query: countSql,
    params: [],
  };

  let resultJson = {};

  crud.sql(countInfo, (count) => {
    console.log(count);
    totalcount = count[0]["COUNT(*)"];
    resultJson.count = totalcount;
    let col =
      " r.report_id  , r.report_title , ifnull(r.report_name , ut.user_name) AS writer,r.report_date_discovery, r.report_date ";
    let sql =
      "SELECT " +
      col +
      " FROM report r  LEFT OUTER JOIN user_tbl ut ON r.report_writer_id  = ut.user_id ORDER BY r.report_date DESC " +
      " LIMIT " +
      limit +
      " OFFSET " +
      offset;

    let sqlInfo = {
      dbName: "endangered",
      query: sql,
      params: [],
    };

    crud.sql(sqlInfo, (result) => {
      for (var i = 0; i < result.length; i++) {
        //console.log(result[i]);
        result[i].report_date = result[i].report_date.substr(0, 10);
      }
      for (var i = 0; i < limit; i++) {
        if (result[i] != null) {
          result[i].report_num = totalcount - offset - i;
          // console.log(totalcount, offset, i);
          // console.log(i);
        }
      }
      resultJson.rows = result;
      //console.log(result);
      res.send(resultJson);
    });
  });
};

exports.insertReport = (req, res) => {
  console.log(req.file);
  console.log(req.body);
  console.log(req.session.loginData);

  let { name, phone, foundDate, foundLocation, content } = req.body;
  let filePath = req.file ? `/uploads/${req.file.filename}` : null;

  let col = ""; // 컬럼
  let val = ""; // sql value 바인드

  let params = []; // 값

  // 로그인하지 않았을 때
  if (!req.session.loginData) {
    col =
      "(report_title, report_content, report_img,  report_name, report_writer_phone, report_date, report_date_discovery, report_location)";
    val = " ?,?,?,?,?,NOW(),?,? ";
    params.push(foundLocation, content, filePath, name, phone, foundDate, null);
  } else {
    let { user_name, user_id, user_phone } = req.session.loginData;
    col =
      "(report_title, report_content, report_img, report_writer_id, report_name, report_writer_phone, report_date, report_date_discovery, report_location)";
    val += " ?,?,?,?,?,?,NOW(),?,? ";
    params.push(
      foundLocation,
      content,
      filePath,
      user_id,
      user_name,
      user_phone,
      foundDate,
      null
    );
  }

  let insertSql = "INSERT INTO report" + col + " VALUES (" + val + ")";

  let insertInfo = {
    dbName: "endangered",
    query: insertSql,
    params: params,
  };

  crud.sql(insertInfo, (result) => {
    if (result.affectedRows > 0) {
      res.send({ status: true });
    } else {
      res.send(404);
    }
  });
};

exports.getReportDetail = (req, res) => {
  console.log(req.query);
  let col = " r.* , ut.user_id ,ut.user_name, ut.user_phone FROM report r ";
  let sql =
    "SELECT " +
    col +
    "LEFT OUTER JOIN user_tbl ut ON r.report_writer_id  = ut.user_id  WHERE r.report_id =?";
  let sqlInfo = {
    dbName: "endangered",
    query: sql,
    params: [req.query.id],
  };
  crud.sql(sqlInfo, (result) => {
    console.log(result);
    const imgUrl = "http://10.10.10.168:3001";
    result[0].imgurl = imgUrl + result[0].report_img; //imgUrl+"kitty.png"

    res.send(result[0]);
  });
  //res.sendStatus(200);
};
