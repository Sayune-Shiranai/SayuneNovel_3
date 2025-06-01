module.exports = async function (fastifyApp, options) {
  fastifyApp.get("/login/google/callback", async function (req, rep) {
    // console.log("Session at callback:", req.session);

    // Lấy token (bao gồm id_token, access_token, refresh_token)
    const { token } =
      await this.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(req);

    const { id_token, google_access_token, google_refresh_token } = token;

    console.log("Full token:", token);

    console.log("id_token: ", token.id_token);

    console.log("access_token: ", token.google_access_token);

    console.log("refresh_token: ", token.google_refresh_token);

    // const { token: newToken } = await this.getNewAccessTokenUsingRefreshToken(
    //   token
    // );

    rep.cookie("google_access_token", google_access_token, {
      httpOnly: true,
      path: "/",
      maxAge: 3,
    });
    if (refresh_token) {
      rep.cookie("google_refresh_token", google_refresh_token, {
        httpOnly: true,
        path: "/",
      });
    }

    // // Lưu thông tin user vào session (nếu dùng session)
    // req.session.user = {
    //   id: user._id,
    //   name: user.name,
    //   email: user.email,
    //   picture: user.picture,
    // };

    // Gán cookie token cho client (tuỳ chọ

    // Chuyển hướng về trang chủ hoặc trang bạn muốn
    rep.redirect("/");
  });
};
