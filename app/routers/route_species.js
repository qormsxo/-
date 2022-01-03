var species = require("../controllers/con_species");

module.exports = function (app) {
  app.get("/species", species.main);
};
