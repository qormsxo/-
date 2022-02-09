var crud = require("../model/crud");

let func = require("./con_answer_func");

const reportCheck = (id) => {
  let sql = "UPDATE report SET report_check= 1 WHERE report_id = ?";
  let info = {
    dbName: "endangered",
    query: sql,
    params: [id],
  };
  crud.sql(info, (result) => {
    console.log("답변 업데이트 :", result);
  });
};

exports.answer = (req, res) => {
  //console.log(req.body);
  let { id, content, spcs_num, spcs_name, spcs_class } = req.body;

  if (spcs_num === 0) {
    spcs_num = null;
    spcs_name = null;
    spcs_class = null;
  }

  let sql =
    "INSERT INTO report_answer (answer_id, answer_content, spcs_num ,spcs_name, spcs_class) VALUES(?,?,?,?,?)";

  let insertInfo = {
    dbName: "endangered",
    query: sql,
    params: [id, content, spcs_num, spcs_name, spcs_class],
  };

  crud.sql(insertInfo, (result) => {
    if (result.affectedRows > 0) {
      reportCheck(id);
      res.sendStatus(200);
    } else {
      res.send(404);
    }
  });
};

exports.updateAnswer = (req, res) => {
  //console.log(req.body);
  let { id, content, spcs_num, spcs_name, spcs_class } = req.body;

  if (spcs_num === 0) {
    spcs_num = null;
    spcs_name = null;
    spcs_class = null;
  }
  //console.log(id, content, spcs_num, spcs_name, spcs_class);

  let sql =
    "UPDATE report_answer  SET answer_content=?, spcs_num=?, spcs_name=?, spcs_class=? WHERE answer_id = ?";

  let params = [content, spcs_num, spcs_name, spcs_class, id];

  let updateInfo = {
    dbName: "endangered",
    query: sql,
    params: params,
  };

  //console.log(updateInfo);

  crud.sql(updateInfo, (result) => {
    if (result.affectedRows > 0) {
      res.sendStatus(200);
    } else {
      res.send(404);
    }
  });
};

exports.deleteAnswer = (req, res) => {
  console.log(req.body);

  let { id } = req.body;

  func.deletfunc(id, (result) => {
    if (result.affectedRows > 0) {
      let reportsql = "UPDATE report SET report_check = ? WHERE report_id =?";
      let updateInfo = {
        dbName: "endangered",
        query: reportsql,
        params: [0, id],
      };
      crud.sql(updateInfo, (callback) => {
        if (callback.affectedRows > 0) {
          res.sendStatus(200);
        } else {
          res.sendStatus(404);
        }
      });
    } else {
      res.send(404);
    }
  });
};
