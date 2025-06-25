async function auth(req, rep) {
  // Kiểm tra xem có token không
  if (req.cookies && req.cookies.accessToken) {
    req.user = null;
    try {
      // Xác thực token
      const user = await req.server.jwt.verify(req.cookies.accessToken);
      req.user = user;
      req.log.info(user);
    } catch (error) {
      console.log("AccessToken hết hạn:", error.message);
    }
  }

  // Nếu token không hợp lệ, kiểm tra refreshToken
  const currentUrl = req.url;
  console.log("Giá trị của currentUrl:", currentUrl);
  if (req.cookies.refreshToken) {
    console.log("Giá trị của refreshToken:", req.cookies.refreshToken);
    try {
      const user = await req.server.jwt.verify(req.cookies.refreshToken, {
        ignoreExpiration: true,
      });
      req.user = user;
      req.log.info(user);

      // Lấy thông tin người dùng từ MongoDB
      const storedUser = await req.server.mongo.db
        .collection("users")
        .findOne({ username: user.username });
      console.log("Giá trị của storedUser:", storedUser);
      console.log(
        "Giá trị của storedUser.refreshToken:",
        storedUser.refreshToken
      );
      console.log("Giá trị của cookie.refreshToken:", req.cookies.refreshToken);
      // Kiểm tra nếu refresh token hợp lệ
      if (storedUser && storedUser.refreshToken === req.cookies.refreshToken) {
        console.log("Giá trị của refreshToken:", storedUser);

        // Tạo Access Token mới
        const newToken = req.server.jwt.sign(
          { username: user.username, role: user.role },
          { expiresIn: "1m" }
        );
        console.log("Giá trị của user.username:", user.username);
        console.log("Giá trị của user.role:", user.role);

        // Tạo Refresh Token mới
        const newRefreshToken = req.server.jwt.sign(
          { username: user.username, role: user.role },
          { expiresIn: "7d" }
        );

        // Cập nhật Refresh Token trong MongoDB
        await req.server.mongo.db
          .collection("users")
          .updateOne(
            { username: user.username },
            { $set: { refreshToken: newRefreshToken } }
          );

        // Gửi Access Token và Refresh Token mới về client
        rep.setCookie("accessToken", newToken, { httpOnly: true });
        console.log("Giá trị của newToken:", newToken);
        rep.setCookie("refreshToken", newRefreshToken, {
          httpOnly: true,
        });

        console.log("Giá trị của newRefreshToken:", newRefreshToken);

        // Lưu thông tin người dùng vào request
        req.user = { username: user.username, role: user.role };
        console.log("Giá trị của currentUrl:", currentUrl);
        // return reply.redirect(currentUrl);
      } else {
        rep.clearCookie("accessToken");
        rep.clearCookie("refreshToken");
        return rep.render("login", {
          errMessage: "Invalid refresh token",
        });
      }
    } catch (err) {
      rep.clearCookie("accessToken");
      rep.clearCookie("refreshToken");
      return rep.render("login", {
        errMessage: "Chưa cung cấp refresh token",
      });
    }
  }
}

module.exports = auth;
