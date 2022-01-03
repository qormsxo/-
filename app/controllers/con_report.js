var crud = require("../model/crud");

exports.getReport = (req, res) => {
  let col =
    " r.report_id  , r.report_title , ifnull(r.report_name , ut.user_name) AS writer,r.report_date_discovery, r.report_date ";
  let sql =
    "SELECT " +
    col +
    " FROM report r  LEFT OUTER JOIN user_tbl ut ON r.report_writer_id  = ut.user_id  ";

  let sqlInfo = {
    dbName: "endangered",
    query: sql,
    params: [],
  };

  crud.sql(sqlInfo, (result) => {
    console.log(result);
    res.send(result);
  });
};
