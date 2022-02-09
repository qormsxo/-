var crud = require("../model/crud");

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
      let sql = "INSERT INTO user_tbl values(?,?,?,?,NOW(),0)";
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
    "SELECT user_name, user_id, user_phone , is_admin FROM user_tbl WHERE user_id = ? AND user_pw = ?";

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
        message: "아이디 또는 비밀번호를 다시 확인해주세요.",
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
