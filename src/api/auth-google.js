// api/auth-google.js

const { OAuth2Client } = require("google-auth-library");

module.exports = async function (fastifyApp, options) {
  const CLIENT_ID = options.clientId;
  const client = new OAuth2Client(CLIENT_ID);
  console.log("CLIENT_ID: ", CLIENT_ID);
  console.log("client: ", client);

  async function verifyGoogleIdToken(idToken) {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    return {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      sub: payload.sub,
    };
  }

  fastifyApp.get("/login/google/callback", async function (req, rep) {
    // console.log("Session at callback:", req.session);

    // Lấy token (bao gồm id_token, access_token, refresh_token)
    const { token } =
      await this.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(req);

    const { id_token, access_token, refresh_token } = token;

    console.log("Full token:", token);

    console.log("id_token: ", token.id_token);

    console.log("access_token: ", token.access_token);

    console.log("refresh_token: ", token.refresh_token);

    // const { token: newToken } = await this.getNewAccessTokenUsingRefreshToken(
    //   token
    // );

    rep.cookie("access_token", access_token, {
      httpOnly: true,
      path: "/",
      maxAge: 3,
    });
    if (refresh_token) {
      rep.cookie("refresh_token", refresh_token, {
        httpOnly: true,
        path: "/",
      });
    }

    const googleUser = await verifyGoogleIdToken(id_token);

    console.log("info id_token", googleUser);

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
