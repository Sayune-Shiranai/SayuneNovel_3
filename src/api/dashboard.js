// const dashboard = require("../Dashboard");

module.exports = async function (fastifyApp, option) {
  fastifyApp.get("/dashboard", function (req, rep) {
    rep.render("dashboard/dashboard");
  });
};
