const { mongodb } = require("@fastify/mongodb");
const { ObjectId } = require("@fastify/mongodb");

module.exports = async function (fastifyApp, option) {
  fastifyApp.get("/dashboard", async function (req, rep) {
    const users = await this.mongo.db.collection("users").find({}).toArray();
    const user = await this.mongo.db
      .collection("users")
      .findOne({ _id: new ObjectId(req.params.id) });
    const libary = await this.mongo.db.collection("Libary").find({}).toArray();
    return rep.render("dashboard/dashboard", {
      libary,
      users,
      user,
      partial: "libary",
    });
  });
};
