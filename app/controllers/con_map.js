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
//       encodeURI("백련산"),
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

exports.address = (req, res) => {
  let address = req.query.keyword;
  var url =
    "https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode" +
    "?query=" +
    encodeURI(address);
  request.get(
    {
      url: url,
      json: true,
      headers: {
        "User-Agent": "request",
        "X-NCP-APIGW-API-KEY-ID": clinetId,
        "X-NCP-APIGW-API-KEY": clinetSecret,
      },
    },
    (err, data) => {
      if (err) {
        console.log("Error:", err);
      } else if (res.statusCode !== 200) {
        console.log("Status:", res.statusCode);
      } else {
        // data is already parsed as JSON:
        console.log(data.body);
        res.send(data.body.data);
      }
    }
  );
};
