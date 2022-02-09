var answer = require("../controllers/con_answer");

module.exports = function (app) {
  app.post("/answer", answer.answer);
  app.put("/answer", answer.updateAnswer);
  app.delete("/answer", answer.deleteAnswer);
};
