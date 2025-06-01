module.exports = async function (fastifyApp, options) {
  fastifyApp.get("/login/google/callback", async function (req, rep) {
    console.log("Session at callback:", req.session);

    // Lấy token (bao gồm id_token, access_token, refresh_token)
    const tokenResponse =
      await fastifyApp.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(
        req
      );

    const { id_token, access_token, refresh_token } = tokenResponse.token;

    if (!id_token) {
      return rep.code(400).send({ error: "Không nhận được id_token" });
    }

    // Lấy thông tin user từ Google API
    const userInfoRes = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    const userInfo = await userInfoRes.json();

    if (!userInfo.email) {
      return rep.code(400).send({ error: "Không lấy được email từ Google" });
    }

    // Lưu hoặc cập nhật user trong MongoDB
    const users = await this.mongo.db.collection("users");
    let user = await users.findOne({ googleId: userInfo.sub });

    if (!user) {
      user = {
        googleId: userInfo.sub,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        createdAt: new Date(),
      };
      await users.insertOne(user);
    }

    // Lưu thông tin user vào session (nếu dùng session)
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
    };

    // Gán cookie token cho client (tuỳ chọ

    // Chuyển hướng về trang chủ hoặc trang bạn muốn
    rep.redirect("/");
  });
};
