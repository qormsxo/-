var crud = require("../model/crud");
const fs = require("fs");

exports.getReport = (req, res) => {
  console.log(req.query);

  let { field, sort, page, user_id } = req.query;

  if (field === "report_num") {
    field = "report_id";
  }

  let offset = page * 10;
  let limit = 10; // 일단 10개로 고정

  let totalcount = 0;

  let countSql = "SELECT COUNT(*) FROM report ";

  let countParams = [];
  if (user_id) {
    countSql += " WHERE report_writer_id =?";
    countParams.push(user_id);
  }

  let countInfo = {
    dbName: "endangered",
    query: countSql,
    params: countParams,
  };

  let resultJson = {};

  crud.sql(countInfo, (count) => {
    //console.log(count);
    totalcount = count[0]["COUNT(*)"];
    resultJson.count = totalcount;
    let params = [];
    let table =
      " report r  LEFT OUTER JOIN user_tbl ut ON r.report_writer_id  = ut.user_id ";

    let col =
      " r.report_id  , r.report_title , ifnull(r.report_name , ut.user_name) AS writer,r.report_date_discovery, r.report_date ";
    if (user_id) {
      table =
        " report r  INNER JOIN user_tbl ut ON r.report_writer_id  = ut.user_id  AND ut.user_id = ? ";
      col =
        " r.report_id  , r.report_title ,  ut.user_name AS writer, r.report_date_discovery, r.report_date ";
      params.push(user_id);
    }
    let sql =
      "SELECT " +
      col +
      " FROM " +
      table +
      "ORDER BY " +
      field +
      " " +
      sort +
      " LIMIT " +
      limit +
      " OFFSET " +
      offset;

    // console.log(sql, params);
    let sqlInfo = {
      dbName: "endangered",
      query: sql,
      params: params,
    };

    crud.sql(sqlInfo, (result) => {
      for (var i = 0; i < result.length; i++) {
        //console.log(result[i]);
        result[i].report_date = result[i].report_date.substr(0, 10);
      }
      if (sort === "desc") {
        for (var i = 0; i < limit; i++) {
          if (result[i] != null) {
            result[i].report_num = totalcount - offset - i;
            // console.log(totalcount, offset, i);
            // console.log(i);
          }
        }
      } else {
        for (var i = 0; i < limit; i++) {
          if (result[i] != null) {
            result[i].report_num = offset + i + 1;
            // console.log(totalcount, offset, i);
            // console.log(i);
          }
        }
      }

      resultJson.rows = result;
      console.log(typeof result);
      //console.log(result);
      res.send(resultJson);
    });
  });
};

exports.insertReport = (req, res) => {
  console.log(req.file);
  console.log(req.body);
  // console.log(req.session.loginData);

  let { name, phone, foundDate, foundLocation, content, pass, coordinates } =
    req.body;
  let filePath = req.file ? `/uploads/${req.file.filename}` : null;

  let col = ""; // 컬럼
  let val = ""; // sql value 바인드

  let params = []; // 값

  // 로그인하지 않았을 때
  if (!req.session.loginData) {
    col =
      "(report_title, report_content, report_img,  report_name, report_writer_phone, report_date, report_date_discovery, report_location, report_password)";
    val = " ?,?,?,?,?,NOW(),?,?,? ";
    params.push(
      foundLocation,
      content,
      filePath,
      name,
      phone,
      foundDate,
      coordinates ? coordinates : null,
      pass
    );
  } else {
    let { user_id } = req.session.loginData;
    col =
      "(report_title, report_content, report_img, report_writer_id, report_date, report_date_discovery, report_location)";
    val += " ?,?,?,?,NOW(),?,? ";
    params.push(
      foundLocation,
      content,
      filePath,
      user_id,
      foundDate,
      coordinates ? coordinates : null
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
    const imgUrl = "http://10.10.10.168:3001";
    result[0].imgurl = imgUrl + result[0].report_img; //imgUrl+"kitty.png"
    console.log(result);
    res.send(result[0]);
  });
  //res.sendStatus(200);
};

exports.updateReport = (req, res) => {
  console.log(req.body);
  let {
    name,
    phone,
    foundDate,
    foundLocation,
    id,
    content,
    fileModify,
    beforeImgName,
    coordinates,
  } = req.body;

  let parmas = [foundLocation, content, foundDate];
  let col = "SET report_title=?, report_content=?, report_date_discovery=? ";
  // 파일이 변경되었을때
  console.log(fileModify);
  if (fileModify === "true") {
    console.log(req.file);
    let filePath = req.file ? `/uploads/${req.file.filename}` : null; // 파일수정시 새로설정된 파일 경로
    col += ", report_img=? "; // 컬럼 설정

    parmas.push(filePath); // 파일경로 추가
    //기존파일 삭제
    if (beforeImgName) {
      fs.unlink("uploads/" + beforeImgName, (err) => {
        if (err) {
          console.log("Error : ", err);
        }
      });
    }
  }
  // 가입한 유저가 아닐때
  if (!req.session.loginData) {
    col += " , report_name= ? , report_writer_phone= ? ";
    parmas.push(name, phone); // 로그인하지 않았을 시
  }

  if (coordinates) {
    col += " , report_location = ? ";
    parmas.push(coordinates);
  }

  let sql = "UPDATE report " + col + "WHERE report_id=?;";
  parmas.push(id);

  //console.log(sql + parmas);
  let updateInfo = {
    dbName: "endangered",
    query: sql,
    params: parmas,
  };

  crud.sql(updateInfo, (result) => {
    if (result.affectedRows > 0) {
      res.sendStatus(200);
    } else {
      res.send(404);
    }
  });
};

exports.deleteReport = (req, res) => {
  console.log(req.body);

  let { id, filename } = req.body;

  let sql = "DELETE FROM report WHERE report_id= ?";

  //기존파일 삭제
  if (filename) {
    fs.unlink("uploads/" + filename, (err) => {
      if (err) {
        console.log("Error : ", err);
      }
    });
  }

  let deleteInfo = {
    dbName: "endangered",
    query: sql,
    params: [id],
  };

  crud.sql(deleteInfo, (result) => {
    if (result.affectedRows > 0) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  });
};
