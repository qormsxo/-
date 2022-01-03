var report = require("../controllers/con_report");

module.exports = function (app) {
  app.get("/report", report.getReport);
};
