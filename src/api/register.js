const { createHmac, randomBytes } = require("node:crypto");

module.exports = async function (fastifyApp, options) {
  fastifyApp.get("/register", function (req, rep) {
    rep.render("register");
  });

  fastifyApp.post("/register", async function (req, rep) {
    const checkuser = await this.mongo.db
      .collection("users")
      .findOne({ username: req.body.username });
    if (!checkuser) {
      if (req.body.password === req.body.confirm) {
        const salt = randomBytes(16).toString("hex");
        const hpass = createHmac("sha256", salt)
          .update(req.body.password)
          .digest("hex");

        const date = new Date();
        const DateNow = date.toLocaleString("vi-VN", {
          timeZone: "Asia/Ho_Chi_Minh",
        });

        const user = await this.mongo.db.collection("users").insertOne({
          username: req.body.username,
          role: req.body.role,
          salt,
          hpass,
          createdDate: DateNow,
        });
        return rep.redirect("/login");
      } else {
        return rep.send({ errMessage: "Nhập lại mật khẩu không khớp!" });
      }
    } else {
      return rep.send({ errMessage: "Tài khoản đã tồn tại!" });
    }
  });
};
