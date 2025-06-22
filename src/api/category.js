const { ObjectId } = require("@fastify/mongodb");

module.exports = async function (fastifyApp, options) {
  fastifyApp.get("/dashboard/category", async function (req, rep) {
    const categories = await this.mongo.db
      .collection("Category")
      .find({})
      .toArray();

    return rep.render("dashboard/dashboard", {
      categories,
      partial: "categories",
    });
  });

  fastifyApp.get("/dashboard/add-category", function (req, rep) {
    return rep.render("dashboard/dashboard", {
      partial: "create-category",
    });
  });

  fastifyApp.post("/dashboard/add-category", async function (req, rep) {
    const category = await this.mongo.db.collection("Category").insertOne({
      theloai: req.body.theloai,
    });
    return rep.redirect("/dashboard/category");
  });

  fastifyApp.get("/dashboard/category/update/:id", async function (req, rep) {
    const category = await this.mongo.db
      .collection("Category")
      .findOne({ _id: new ObjectId(req.params.id) });
    return rep.render("dashboard/dashboard", {
      category,
      partial: "update-category",
    });
  });

  fastifyApp.post("/dashboard/category/update/:id", async function (req, rep) {
    const category = await this.mongo.db.collection("Category").updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $set: {
          theloai: req.body.theloai,
        },
      }
    );
    rep.redirect("/dashboard/category");
  });

  fastifyApp.get("/dashboard/category/delete/:id", async function (req, rep) {
    const category = await this.mongo.db
      .collection("Category")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    rep.redirect("/dashboard/category");
  });
};
