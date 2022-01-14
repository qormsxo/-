var map = require("../controllers/con_map");

module.exports = function (app) {
  app.get("/address", map.address);

  //pp.post("/");
  //app.post('/login', );
  //app.get('/logout', login.logout);
};
