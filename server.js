// 사용 모듈 참조
var express = require("express"),
  http = require("http"),
  path = require("path"),
  config = require("config");
// session = require("express-session"),
// cookieParser = require("cookie-parser"),
// bodyParser = require("body-parser"),
// nocache = require("nocache"),
// flash = require("connect-flash");

//서버 생성
var app = express();
var server = http.createServer(app);

// 서버 접속 시 연결 page 관련
// require(path.join(__dirname, "app/pages/pages.js"))(app);
require("./app/pages/pages")(app);

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

//포트 설정(config에서 가져오기)
app.set("port", config.get("port"));

// process.on('uncaughtException', function (err) {
// 	//예상치 못한 예외 처리
// 	console.log('uncaughtException 발생 : ' + err);
// });

//서버 실행
// server.listen(app.get("port"), function () {
//   console.log("##Server port " + app.get("port"));
// });
server.listen(app.get("port"), () => {
  console.log("##Server port " + app.get("port"));
});
