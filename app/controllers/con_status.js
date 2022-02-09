var crud = require("../model/crud");

exports.getReportStaus = (req, res) => {
  let { keyword, select } = req.query;

  console.log(keyword, select);

  let col = " es.name ,count(ra.spcs_num) as count ";
  let table =
    " endng_spcs es LEFT OUTER JOIN report_answer ra ON es.spcs_num = ra.spcs_num ";
  let where = " WHERE 1=1 ";
  let params = [];
  let limit = "LIMIT 10";

  // 전체가 아닐때
  if (select !== "all") {
    where += " AND classification = ? ";
    params.push(select);
    // 선택했을때
  }
  if (keyword !== "") {
    where += " AND es.name LIKE  CONCAT('%',?,'%')  ";
    params.push(keyword);
  }
  //   else {
  //     limit += " LIMIT 10";
  //   }

  let sql =
    "SELECT " +
    col +
    " FROM " +
    table +
    where +
    " GROUP BY es.name ORDER BY 2 DESC " +
    limit;

  //console.log(sql);

  let selectInfo = {
    dbName: "endangered",
    query: sql,
    params: params,
  };

  crud.sql(selectInfo, (status) => {
    res.send(status);
  });
};

exports.getReportMapStatus = (req, res) => {
  let { keyword, select } = req.query;

  let col =
    " es.name , ra.answer_content , r.report_title , r.report_lat, r.report_lng , r.report_id ";
  let table =
    " endng_spcs es LEFT OUTER JOIN report_answer ra ON es.spcs_num = ra.spcs_num INNER JOIN report r ON ra.answer_id = r.report_id ";
  let where = " WHERE r.report_check = 1 AND ra.spcs_num IS NOT null ";
  let params = [];
  if (select !== "all") {
    where += " AND es.classification = ? ";
    params.push(select);
  }
  if (keyword !== "") {
    where += " AND es.name LIKE  CONCAT('%',?,'%')  ";
    params.push(keyword);
  }
  let sql = "SELECT " + col + " FROM " + table + where;

  //console.log(sql, params);

  let sqlInfo = {
    dbName: "endangered",
    query: sql,
    params: params,
  };

  crud.sql(sqlInfo, (result) => {
    for (var i = 0; i < result.length; i++) {
      result[i].report_lat = Number(result[i].report_lat);
      result[i].report_lng = Number(result[i].report_lng);
    }
    console.log(result);
    res.send(result);
  });
};
