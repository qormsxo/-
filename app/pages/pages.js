module.exports = function (app) {
  // app setting
  require("./express")(app); //현재폴더(project_test/app/connect) 기준 미들웨어 사용 설정

  require("../routers/route_user")(app); // 인덱스?
};