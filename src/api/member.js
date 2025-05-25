//src/api/member.js
module.exports = async function (fastifyApp, options) {
  fastifyApp.get("/member", async function (req, rep) {
    const users = await this.mongo.db.collection("users").find({}).toArray();
    return rep.render("dashboard/dashboard", { users });
  });
};
