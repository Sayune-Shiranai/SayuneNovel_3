const { createHmac, randomBytes } = require("node:crypto");
const validator = require("validator");

module.exports = async function (fastifyApp, options) {
  fastifyApp.get("/register", function (req, rep) {
    rep.render("register", {
      formData: {}, // đảm bảo form không lỗi khi lần đầu truy cập
      errorMessage: {}, // tránh undefined trong template
    });
  });

  fastifyApp.post("/register", async function (req, rep) {
    const { username, email, role, password, confirm } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    if (!username || !password || !confirm) {
      return rep.render("register", {
        errorMessage: {
          username: !username ? "Tên đăng nhập không được để trống" : null,
          email: !normalizedEmail ? "Email không được để trống" : null,
          password: !password ? "Mật khẩu không được để trống" : null,
          confirm: !confirm ? "Vui lòng nhập lại mật khẩu" : null,
        },
        formData: req.body,
      });
    }

    const checkuser = await this.mongo.db
      .collection("users")
      .findOne({ username });

    if (checkuser) {
      return rep.render("register", {
        errorMessage: {
          username: "Tài khoản đã tồn tại!",
        },
        formData: req.body,
      });
    }

    const checkemail = await this.mongo.db
      .collection("users")
      .findOne({ email: normalizedEmail });

    if (checkemail) {
      return rep.render("register", {
        errorMessage: {
          email: "Email đã được sử dụng!",
        },
        formData: req.body,
      });
    }

    if (!validator.isEmail(normalizedEmail)) {
      errorMessage.email = "Email không hợp lệ";
    }

    if (password.length < 6) {
      return rep.render("register", {
        errorMessage: {
          password: "Mật khẩu phải có ít nhất 6 ký tự.",
        },
        formData: req.body,
      });
    }

    if (password !== confirm) {
      return rep.render("register", {
        errorMessage: {
          confirm: "Nhập lại mật khẩu không khớp!",
        },
        formData: req.body,
      });
    }

    const salt = randomBytes(16).toString("hex");
    const hpass = createHmac("sha256", salt).update(password).digest("hex");

    const vnTime = new Date().toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
    });

    await this.mongo.db.collection("users").insertOne({
      username,
      email: normalizedEmail,
      role,
      salt,
      hpass,
      createdDate: vnTime,
    });

    return rep.redirect("/login");
  });
};
