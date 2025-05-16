module.exports = async function (fastifyApp, options) {
  fastifyApp.get("/login", function (req, rep) {
    rep.render("login");
  });
};
