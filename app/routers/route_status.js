var status = require("../controllers/con_status");

module.exports = function (app) {
  app.get("/report-status", status.getReportStaus);
  app.get("/report-mapstatus", status.getReportMapStatus);
};
