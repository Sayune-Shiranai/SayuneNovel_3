module.exports = async function (fastifyApp, options) {
  fastifyApp.get("/register", function (req, rep) {
    rep.render("register");
  });
};
