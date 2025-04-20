// const dashboard = require("../Dashboard");

function dashboard(fastifyApp, option, done) {
  fastifyApp.get("/dashboard", function (req, rep) {
    rep.render("dashboard");
  });
  done();
}

module.exports = dashboard;
