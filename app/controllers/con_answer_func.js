var crud = require("../model/crud");

// 공통된 로직을 쓰는곳이 두곳 이상이거나 답변 관련 해서 다른 곳에서 가져오는 함수 파일

// 답변 삭제 및 제보 삭제에 사용
exports.deletfunc = (id, callback) => {
  let sql = "DELETE FROM report_answer WHERE answer_id = ?";
  let deleteInfo = {
    dbName: "endangered",
    query: sql,
    params: [id],
  };

  crud.sql(deleteInfo, (result) => {
    callback(result);
  });
};

//제보 상세정보에 사용됨
exports.getAnswer = (id, callback) => {
  let sql = "SELECT * FROM report_answer WHERE answer_id =?";
  let sqlInfo = {
    dbName: "endangered",
    query: sql,
    params: [id],
  };
  crud.sql(sqlInfo, (result) => {
    callback(result);
  });
};
