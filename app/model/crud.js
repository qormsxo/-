var mariadb = require("mariadb");
var config = require("config");

const pool = mariadb.createPool(config.get("mariadb_option"));

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// select
//mariadb select query 수행 2
async function execution(Model, dbName, query, params, callback) {
  let conn, rows;
  try {
    conn = await Model.getConnection();
    conn.query("USE " + dbName);
    rows = await conn.query(query, params);
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    if (conn) conn.end();
    callback(rows);
  }
}

//mariadb select query 수행 1
exports.sql = function (data, callback) {
  var dbName = data.dbName;
  var query = data.query;
  var params = data.params;

  execution(pool, dbName, query, params, function (result) {
    callback(result);
  });
};

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// table count 체크
// exports.count_chk = function (data, callback) {
//   var db_name = data.db_name;
//   var db_query = data.query;
//   var db_params = data.params;

//   var db_params = data.params;

//   db_select(pool, db_name, db_query, db_params, function (result) {
//     callback(result);
//   });
// };
