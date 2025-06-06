// src/routes/home.js
module.exports = async function (fastifyApp, options) {
  fastifyApp.get("/danh-sach-the-loai", async function (req, rep) {
    const theloai = await this.mongo.db
      .collection("Category")
      .find({})
      .toArray();
    return rep.render("list-category", { theloai });
  });

  fastifyApp.get("/create-category", function handler(req, rep) {
    rep.render("create-category");
  });

  fastifyApp.post("/create-category", async function (req, rep) {
    const result = await this.mongo.db.collection("Category").insertOne({
      theloai: req.body.theloai,
    });
    return rep.redirect("/danh-sach-the-loai");
  });
};
