var crud = require("../model/crud");
var request = require("request");

// const clinetId = "gygq7dx7oe";
// const clinetSecret = "qqxM5SqTEKu6app0Ei2vtV0RYiKr09NgYhgF3v9N";

// const devClientId = "pYaYMmvepVNchFyjYf_S";
// const devClientSecret = "ATZbjKNw_A";
// request.get(
//   {
//     url:
//       "https://openapi.naver.com/v1/search/local.json" +
//       "?query=" +
//       encodeURI("응암동"),
//     json: true,
//     headers: {
//       "User-Agent": "request",
//       "X-Naver-Client-Id": devClientId,
//       "X-Naver-Client-Secret": devClientSecret,
//     },
//   },
//   (err, data) => {
//     if (err) {
//       console.log("Error:", err);
//     } else {
//       // data is already parsed as JSON:
//       console.log(data.body);
//       // res.send(data.body.data);
//     }
//   }
// );

// exports.main = (req, res) => {
//   let address = "응암동 427-101";
//   var url =
//     "https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode" +
//     "?query=" +
//     encodeURI(address);
//   request.get(
//     {
//       url: url,
//       json: true,
//       headers: {
//         "User-Agent": "request",
//         "X-NCP-APIGW-API-KEY-ID": clinetId,
//         "X-NCP-APIGW-API-KEY": clinetSecret,
//       },
//     },
//     (err, data) => {
//       if (err) {
//         console.log("Error:", err);
//       } else if (res.statusCode !== 200) {
//         console.log("Status:", res.statusCode);
//       } else {
//         // data is already parsed as JSON:
//         console.log(data.body);
//         res.send(data.body.data);
//       }
//     }
//   );
// };

exports.insertUser = (req, res) => {
  console.log(req.body);

  let checkSql = "SELECT user_id FROM user_tbl WHERE user_id = ?";

  let checkInfo = {
    dbName: "endangered",
    query: checkSql,
    params: [req.body.id],
  };

  crud.sql(checkInfo, (docs) => {
    console.log(docs);
    // 겹치는 이메일이 없을 시
    if (!docs[0]) {
      // 등록
      let sql = "INSERT INTO user_tbl values(?,?,?,?,NOW())";
      let setInfo = {
        dbName: "endangered",
        query: sql,
        params: [req.body.id, req.body.password, req.body.name, req.body.phone],
      };
      crud.sql(setInfo, (result) => {
        console.log(result);
        if (result.affectedRows > 0) {
          res.send({ status: true });
        } else {
          res.send(404);
        }
      });
    } else if (Object.keys(docs[0]).includes("user_id")) {
      res.send({ status: false, message: "사용중인 아이디입니다." });
    } else {
      res.send(404);
    }
  });
};

exports.updateUser = (req, res) => {
  let { userId, userPw, name, phone } = req.body;

  // 등록
  let sql =
    "UPDATE user_tbl SET user_pw=?, user_name=?, user_phone=?  WHERE user_id=?;";
  let setInfo = {
    dbName: "endangered",
    query: sql,
    params: [userPw, name, phone, userId],
  };
  crud.sql(setInfo, (result) => {
    console.log(result);
    if (result.affectedRows > 0) {
      res.send({ status: true });
    } else {
      res.send(404);
    }
  });
};

exports.login = (req, res) => {
  console.log(req.body);

  let loginSql =
    "SELECT user_name, user_id, user_phone FROM user_tbl WHERE user_id = ? AND user_pw = ?";

  let loginInfo = {
    dbName: "endangered",
    query: loginSql,
    params: [req.body.id, req.body.password],
  };

  crud.sql(loginInfo, (callback) => {
    console.log(callback);
    if (!callback[0]) {
      res.send({
        status: false,
        message: "이메일 또는 비밀번호를 다시 확인해주세요.",
      });
    } else if (Object.keys(callback[0]).includes("user_id")) {
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
      res.sendStatus(200);
    }
  });
};
