var multer = require("multer");
var storage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(request, "upload/");
  },
  filename: (request, file, callback) => {
    /* 확장자를 제외한 파일명 */
    var basename = path.basename(file.basename);
    /* 파일의 중복과 덮어쓰기를 방지하기 위해 시간을 붙인다 */
    var date = Date.now();

    callback(request, date + "_" + basename);
  },
});

var upload = multer({
  storage: storage,
  limits: {
    files: 10 /* 한번에 업로드할 최대 파일 개수 */,
    fileSize: 1024 * 1024 * 10 /* 업로드할 파일의 최대 크기 */,
  },
});

module.exports = upload;
