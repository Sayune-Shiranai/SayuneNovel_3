// const dashboard = require("../Dashboard");
const { ObjectId } = require("@fastify/mongodb");

module.exports = async function (fastifyApp, option) {
  fastifyApp.get("/dashboard", async function (req, rep) {
    const users = await this.mongo.db.collection("users").find({}).toArray();
    // const user = await this.mongo.db
    //   .collection("users")
    //   .findOne({ _id: new ObjectId(req.params.id) });
    return rep.render("dashboard/dashboard", {
      users,
      user: null,
      partial: "member",
    });
  });
};
