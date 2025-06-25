const auth = require("../services/auth");

module.exports = async function (fastifyApp, options) {
  fastifyApp.post("/logout", { onRequest: auth }, async function (req, rep) {
    const user = req.user;
    req.log.info(req.user);

    if (user) {
      rep.clearCookie("accessToken", { path: "/" });
      rep.clearCookie("refreshToken", { path: "/" });

      await this.mongo.db
        .collection("users")
        .updateOne(
          { username: user.username },
          { $unset: { refreshToken: "" } }
        );
      rep.redirect("/");
    }

    rep.code(200).send({ message: "Đăng xuất thành công" });
    return rep;
  });
};
