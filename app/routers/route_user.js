var user = require("../controllers/con_user");

module.exports = function (app) {
  app.get("/", user.main);
  app.post("/user", user.insertUser);
  app.get("/session", user.getSession);
  app.post("/login", user.login);
  app.post("/logout", user.logout);
  //pp.post("/");
  //app.post('/login', );
  //app.get('/logout', login.logout);
};
