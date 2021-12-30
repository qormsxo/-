var logger = require("morgan"),
  body_parser = require("body-parser"),
  config = require("config"),
  express = require("express"),
  session = require("express-session"),
  nocache = require("nocache"),
  flash = require("connect-flash"),
  cors = require("cors");

module.exports = function (app) {
  //console.log("express.js play");

  app.use(body_parser.urlencoded({ extended: true }));
  app.use(body_parser.json());

  const corsOptions = {
    origin: "http://10.10.10.168:3000",
    credentials: true,
  };

  app.use(cors(corsOptions));

  app.use(
    session({
      secret: "@#@$MYSIGN#@$#$",
      resave: false,
      saveUninitialized: true,
    })
  );
  app.use(logger("dev")); //웹 요청이 들어왔을 때 로그를 출력

  // app.use(flash());

  // app.use(nocache());

  app.use(express.static(config.get("path.public")));
};
