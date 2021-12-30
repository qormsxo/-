var crud = require("../model/crud");
var request = require("request");

const apiKey =
  "wC2klb%2BIVcpUBK2Sd2qExv%2BTmgl%2FT66h6oohdYIrFGoHuVR6bVlFZRr%2FkDONSkI6UuI8iBrNtwKq6sSae165HA%3D%3D";

exports.main = (req, res) => {
  var url =
    "https://api.odcloud.kr/api/3071040/v1/uddi:4a6d6ef0-b2ae-4b8e-914a-ea645f743d50_201808031350" +
    "?page=1" +
    "&perPage=267" +
    "&returnType=JSON" +
    "&serviceKey=" +
    apiKey;
  request.get(
    {
      url: url,
      json: true,
      headers: { "User-Agent": "request" },
    },
    (err, data) => {
      if (err) {
        console.log("Error:", err);
      } else if (res.statusCode !== 200) {
        console.log("Status:", res.statusCode);
      } else {
        // data is already parsed as JSON:
        res.send(data.body.data);
      }
    }
  );
};

exports.insertUser = (req, res) => {
  console.log(req.body);

  let checkSql = "SELECT user_email FROM user_tbl WHERE user_email = ?";

  let checkInfo = {
    dbName: "endangered",
    query: checkSql,
    params: [req.body.email],
  };

  crud.sql(checkInfo, (docs) => {
    console.log(docs);
    // 겹치는 이메일이 없을 시
    if (!docs[0]) {
      // 등록
      let sql = "INSERT INTO user_tbl values(?,?,?,NOW())";
      let setInfo = {
        dbName: "endangered",
        query: sql,
        params: [req.body.email, req.body.password, req.body.name],
      };
      crud.sql(setInfo, (result) => {
        console.log(result);
        if (result.affectedRows > 0) {
          res.send({ status: true });
        } else {
          res.send(404);
        }
      });
    } else if (Object.keys(docs[0]).includes("user_email")) {
      res.send({ status: false, message: "사용중인 이메일입니다." });
    } else {
      res.send(404);
    }
  });
};

exports.login = (req, res) => {
  console.log(req.body);

  let loginSql =
    "SELECT user_name, user_email FROM user_tbl WHERE user_email = ? AND user_pw = ?";

  let loginInfo = {
    dbName: "endangered",
    query: loginSql,
    params: [req.body.email, req.body.password],
  };

  crud.sql(loginInfo, (callback) => {
    console.log(callback);
    if (!callback[0]) {
      res.send({
        status: false,
        message: "이메일 또는 비밀번호를 다시 확인해주세요.",
      });
    } else if (Object.keys(callback[0]).includes("user_email")) {
      req.session.loginData = callback[0];
      req.session.save(function (error) {
        console.log(req.session);
        res.send({ status: true });
      });
    }
  });
};

exports.getSession = (req, res) => {
  //console.log(req.session);
  res.send(req.session.loginData);
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.send(200);
    }
  });
};
