module.exports = function (app) {
  // app setting
  require("./express")(app); //현재폴더(project_test/app/connect) 기준 미들웨어 사용 설정

  require("../routers/route_user")(app); // 인덱스?
  require("../routers/route_species")(app); // 멸종위기종 조회
  require("../routers/route_report")(app); // 제보 관련
  require("../routers/route_map")(app); // 네이버
};
