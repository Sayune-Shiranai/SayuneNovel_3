// const dashboard = require("../Dashboard");

module.exports = async function (fastifyApp, option) {
  fastifyApp.get("/dashboard", async function (req, rep) {
    const users = await this.mongo.db.collection("users").find({}).toArray();
    return rep.render("dashboard/dashboard", { users });
  });
};
