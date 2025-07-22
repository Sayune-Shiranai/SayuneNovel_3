// api/auth-google.js

const { OAuth2Client } = require("google-auth-library");

module.exports = async function (fastifyApp, options) {
  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  // khởi tạo OAuth2Client
  // OAuth2Client lưu trữ CLIENT_ID và là "công cụ" giúp bạn thao tác với OAuth 2.0 như verifyIdToken
  const client = new OAuth2Client(CLIENT_ID);
  // console.log("CLIENT_ID: ", CLIENT_ID);
  // console.log("client: ", client);

  async function verifyGoogleIdToken(idToken) {
    const checkIdToken = await client.verifyIdToken({
      //id_token truyền tham số vào tên biến idToken, id_token lấy trong const userInfo = await verifyGoogleIdToken(id_token);
      idToken,
      audience: CLIENT_ID,
    });

    const user_info = checkIdToken.getPayload();
    return user_info;
  }

  fastifyApp.get("/login/google/callback", async function (req, rep) {
    // console.log("Session at callback:", req.session);

    // Lấy token (bao gồm id_token, access_token, refresh_token)
    const { token } =
      await this.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(req);

    const { id_token, access_token, refresh_token } = token;

    // console.log("Full token:", token);

    // console.log("id_token: ", token.id_token);

    // console.log("access_token: ", token.access_token);

    // console.log("refresh_token: ", token.refresh_token);

    const userInfo = await verifyGoogleIdToken(id_token);
    console.log("UserInfo:", userInfo);

    const checkuser = await this.mongo.db
      .collection("users")
      .findOne({ email: userInfo.email });

    const vnTime = new Date().toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
    });

    if (!checkuser) {
      await this.mongo.db.collection("users").insertOne({
        sub: userInfo.sub,
        username: userInfo.name,
        email: userInfo.email,
        role: "user",
        picture: userInfo.picture,
        createdDate: vnTime,
        refresh_token,
      });
    } else {
      await this.mongo.db.collection("users").updateOne(
        { email: checkuser.email },
        {
          $set: {
            email: userInfo.email,
            picture: userInfo.picture,
          },
        }
      );
    }

    let user = await this.mongo.db
      .collection("users")
      .findOne({ email: userInfo.email });

    const accessToken = this.jwt.sign(
      { username: user.username, role: user.role },
      { expiresIn: "1m" }
    );

    const refreshToken = this.jwt.sign(
      { username: user.username, role: user.role },
      { expiresIn: "7d" }
    );

    await this.mongo.db
      .collection("users")
      .updateOne({ email: user.email }, { $set: { refreshToken } });

    rep.cookie("accessToken", accessToken, {
      httpOnly: true,
      path: "/",
    });
    rep.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/",
    });

    return rep.redirect("/");
  });
};
