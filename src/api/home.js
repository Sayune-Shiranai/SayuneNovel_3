// src/routes/home.js
const auth = require("../services/auth");
const authority = require("../services/authority");
module.exports = async function (fastifyApp, options) {
  fastifyApp.get("/", { onRequest: auth }, async function (req, rep) {
    const theloai = await this.mongo.db
      .collection("Category")
      .find({})
      .toArray();

    const libary = await this.mongo.db.collection("Libary").find({}).toArray();

    // Gửi thêm thông tin user nếu đã đăng nhập
    const user = req.user || null;

    return rep.render("index", {
      libary,
      theloai,
      user,
      partial: "home",
    });
  });
};
