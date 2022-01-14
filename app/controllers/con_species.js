var crud = require("../model/crud");

exports.main = (req, res) => {
  console.log(req.query);

  let { field, sort, page, keyword, select } = req.query;
  //console.log(field, sort, page, keyword, select);
  let offset = page * 10;
  let limit = 10; // 일단 10개로 고정

  let totalcount = 0;

  let params = [];
  let where = " where 1=1 ";

  if (keyword) {
    where += " AND name LIKE  CONCAT('%',?,'%') ";
    params.push(keyword);
  }
  if (select) {
    if (select !== "all") {
      where += " AND classification = ? ";
      params.push(select);
    }
  }

  let countSql = "SELECT COUNT(*) FROM endng_spcs " + where;
  //console.log(countSql, params);
  let countInfo = {
    dbName: "endangered",
    query: countSql,
    params: params,
  };

  let resultJson = {};

  crud.sql(countInfo, (count) => {
    totalcount = count[0]["COUNT(*)"];
    resultJson.count = totalcount;

    let sql =
      "SELECT classification , grade , name ,scientific  FROM endng_spcs es " +
      where +
      "ORDER BY " +
      field +
      " " +
      sort +
      " LIMIT " +
      limit +
      " OFFSET " +
      offset;

    let sqlInfo = {
      dbName: "endangered",
      query: sql,
      params: params,
    };

    crud.sql(sqlInfo, (result) => {
      resultJson.rows = result;
      res.send(resultJson);
    });
  });
};

exports.getClass = (req, res) => {
  let sql = "SELECT classification FROM endng_spcs  GROUP BY classification ";

  let classInfo = {
    dbName: "endangered",
    query: sql,
    params: [],
  };

  crud.sql(classInfo, (result) => {
    let array = [];
    for (var i = 0; i < result.length; i++) {
      array.push(result[i].classification);
    }
    res.send(array);
  });
};
