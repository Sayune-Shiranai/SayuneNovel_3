// src/routes/home.js
module.exports = async function (fastifyApp, options) {
  fastifyApp.get("/", async function (req, rep) {
    const theloai = await this.mongo.db
      .collection("Category")
      .find({})
      .toArray();

    return rep.render("home", { theloai }); // Sử dụng rep.view nếu đã đăng ký view engine
  });
};
