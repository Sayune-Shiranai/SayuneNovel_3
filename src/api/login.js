const { createHmac } = require("node:crypto");

module.exports = async function (fastifyApp, options) {
  fastifyApp.get("/login", function (req, rep) {
    rep.render("login", {
      formData: {},
      errorMessage: {},
    });
  });

  fastifyApp.post("/login", async function (req, rep) {
    const { username, password } = req.body;

    if (!username || !password) {
      return rep.render("login", {
        errorMessage: {
          username: !username ? "Vui lòng nhập tên đăng nhập!" : null,
          password: !password ? "Vui lòng nhập mật khẩu!" : null,
        },
      });
    }

    const user = await this.mongo.db.collection("users").findOne({ username });

    if (user) {
      const hpass = createHmac("sha256", user.salt)
        .update(req.body.password)
        .digest("hex");
      if (hpass === user.hpass) {
        // const token = this.jwt.sign(
        //   { username: user.username, role: user.role },
        //   { expiresIn: "1m" }
        // );

        // const refreshToken = this.jwt.sign(
        //   { username: user.username, role: user.role },
        //   { expiresIn: "7d" }
        // );

        // await this.mongo.db
        //   .collection("users")
        //   .updateOne({ username: user.username }, { $set: { refreshToken } });

        // rep.cookie("token", token, { httpOnly: true });
        // rep.cookie("refreshToken", refreshToken, { httpOnly: true });

        return rep.redirect("/");

        // if (user.role === "admin") {
        //   rep.redirect("/dashboard");
        // } else if (user.role === "user") {
        //   rep.redirect("/");
        // }
      } else {
        return rep.render("login", {
          errorMessage: {
            password: "Tên đăng nhập hoặc mật khẩu không đúng!",
          },
        });
      }
    } else {
      return rep.render("login", {
        errorMessage: {
          password: "Tên đăng nhập hoặc mật khẩu không đúng!",
        },
      });
    }

    // Lưu thông tin người dùng vào session hoặc cookie tùy Fastify cấu hình
    // req.session.user = user;

    // return rep.redirect("/");
  });
};
