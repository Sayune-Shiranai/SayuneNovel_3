const { ObjectId } = require("@fastify/mongodb");
const auth = require("../services/auth");
const authority = require("../services/authority");

module.exports = async function (fastifyApp, option) {
  //router(get/dashboard): return list book
  fastifyApp.get(
    "/dashboard",
    { onRequest: [auth, authority("admin")] },
    async function (req, rep) {
      const users = await this.mongo.db.collection("users").find({}).toArray();
      const user = await this.mongo.db
        .collection("users")
        .findOne({ _id: new ObjectId(req.params.id) });
      const libary = await this.mongo.db
        .collection("Libary")
        .find({})
        .sort({ id: 1 })
        .toArray();
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
    }
  );
};
