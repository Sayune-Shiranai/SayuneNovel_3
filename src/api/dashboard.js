const { ObjectId } = require("@fastify/mongodb");

module.exports = async function (fastifyApp, option) {
  fastifyApp.get("/dashboard", async function (req, rep) {
    const users = await this.mongo.db.collection("users").find({}).toArray();
    const user = await this.mongo.db
      .collection("users")
      .findOne({ _id: new ObjectId(req.params.id) });
    const libary = await this.mongo.db.collection("Libary").find({}).toArray();
    const categories = await this.mongo.db
      .collection("Category")
      .find({})
      .toArray();
    const category = await this.mongo.db
      .collection("users")
      .findOne({ _id: new ObjectId(req.params.id) });
    return rep.render("dashboard/dashboard", {
      libary,
      categories,
      category,
      users,
      user,
      partial: "libary",
    });
  });
};
