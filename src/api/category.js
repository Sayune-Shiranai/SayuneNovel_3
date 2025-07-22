const { ObjectId } = require("@fastify/mongodb");

module.exports = async function (fastifyApp, options) {
  //router(get/dashboard/category): return list category
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

  //router(get/dashboard/add-category): create a new category form
  fastifyApp.get("/dashboard/add-category", function (req, rep) {
    return rep.render("dashboard/dashboard", {
      partial: "create-category",
    });
  });

  //post(get/dashboard/add-category): create a new category
  fastifyApp.post("/dashboard/add-category", async function (req, rep) {
    const category = await this.mongo.db.collection("Category").insertOne({
      theloai: req.body.theloai,
    });
    return rep.redirect("/dashboard/category");
  });

  //router(get/dashboard/category/update/:id): update a category form
  fastifyApp.get("/dashboard/category/update/:id", async function (req, rep) {
    const category = await this.mongo.db
      .collection("Category")
      .findOne({ _id: new ObjectId(req.params.id) });
    return rep.render("dashboard/dashboard", {
      category,
      partial: "update-category",
    });
  });

  //router(post/dashboard/category/update/:id): update a category
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

  //router(get/dashboard/category/delete/:id): delete a category
  fastifyApp.get("/dashboard/category/delete/:id", async function (req, rep) {
    const category = await this.mongo.db
      .collection("Category")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    rep.redirect("/dashboard/category");
  });
};
