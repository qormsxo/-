var crud = require("../model/crud");

exports.main = (req, res) => {
  let sql =
    "SELECT classification , grade , name FROM endng_spcs es ORDER BY classification DESC";

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
