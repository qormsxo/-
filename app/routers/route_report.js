var report = require("../controllers/con_report");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage: storage });

module.exports = function (app) {
  app.get("/report", report.getReport);

  app.post("/report", upload.single("uploadedFile"), report.insertReport);
  app.get("/reportdetail", report.getReportDetail);

  app.put("/report", upload.single("uploadedFile"), report.updateReport);
  app.delete("/report", report.deleteReport);
};

// var multipartMiddleware = multipart();
// var storage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, "uploadedFile/");
//   },
//   filename: (req, file, callback) => {
//     /* 확장자를 제외한 파일명 */
//     var basename = path.basename(file.basename);
//     /* 파일의 중복과 덮어쓰기를 방지하기 위해 시간을 붙인다 */
//     var date = Date.now();

//     callback(req, date + "_" + basename);
//   },
// });

// var upload = multer({
//   storage: storage,
//   limits: {
//     files: 10 /* 한번에 업로드할 최대 파일 개수 */,
//     fileSize: 1024 * 1024 * 10 /* 업로드할 파일의 최대 크기 */,
//   },
// });
