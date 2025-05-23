module.exports = async function (fastifyApp, options) {
  fastifyApp.get("/login", function (req, rep) {
    rep.render("login");
  });

  fastifyApp.post("/login", async function (req, rep) {
    // const action = req.body.action;

    if (req.body.username && req.body.passwword) {
      const user = await this.mongodb
        .collection("users")
        .findOne({ username: req.body.username });
    }
  });
};
