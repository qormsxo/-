var path = require("path");

module.exports = {
  // config 변수 및 값 설정
  port: 3001,
  path: {
    public: path.join(__dirname, "../public"),
  },
  mariadb_option: {
    host: "localhost",
    port: "3306",
    user: "root",
    password: "root",
    dateStrings: "date",
    connectionLimit: 5,
  },
};
