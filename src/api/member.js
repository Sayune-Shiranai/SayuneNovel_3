const { ObjectId } = require("@fastify/mongodb");

//src/api/member.js
module.exports = async function (fastifyApp, options) {
  fastifyApp.get("/dashboard/member", async function (req, rep) {
    const users = await this.mongo.db.collection("users").find({}).toArray();
    // const body = await rep.render(
    //   "dashboard/member.ejs",
    //   { users },
    //   { raw: true }
    // );
    return rep.render("dashboard/dashboard", {
      users,
      user: null,
      partial: "member",
    });
  });

  fastifyApp.get("/dashboard/member/update/:id", async function (req, rep) {
    const user = await this.mongo.db
      .collection("users")
      .findOne({ _id: new ObjectId(req.params.id) });
    return rep.render("dashboard/dashboard", {
      user,
      users: [],
      partial: "update-member",
    });
  });

  fastifyApp.post("/dashboard/member/update/:id", async function (req, rep) {
    const result = await this.mongo.db.collection("users").updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          role: req.body.role,
        },
      }
    );
    rep.redirect("/dashboard/member");
  });

  // fastifyApp.get("/dashboard/member/delete/:id", async function (req, rep) {
  //   const result = await this.mongo.db
  //     .collection("users")
  //     .deleteOne({ _id: new ObjectId(req.params.id) });
  //   rep.redirect("/dashboard/member");
  // });
};
