// api/auth-google.js

const { OAuth2Client } = require("google-auth-library");

module.exports = async function (fastifyApp, options) {
  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  // khởi tạo OAuth2Client
  // OAuth2Client lưu trữ CLIENT_ID và là "công cụ" giúp bạn thao tác với OAuth 2.0 như verifyIdToken
  const client = new OAuth2Client(CLIENT_ID);
  console.log("CLIENT_ID: ", CLIENT_ID);
  console.log("client: ", client);

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

    console.log("Full token:", token);

    console.log("id_token: ", token.id_token);

    console.log("access_token: ", token.access_token);

    console.log("refresh_token: ", token.refresh_token);

    const userInfo = await verifyGoogleIdToken(id_token);
    console.log("UserInfo:", userInfo);

    const checkuser = await this.mongo.db
      .collection("users")
      .findOne({ sub: userInfo.sub });

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
        { sub: checkuser.sub },
        {
          $set: {
            username: userInfo.name,
            email: userInfo.email,
            picture: userInfo.picture,
          },
        }
      );
    }

    // Sau khi insert/update xong, lấy lại user từ DB
    let user = await this.mongo.db
      .collection("users")
      .findOne({ sub: userInfo.sub });

    // Tạo JWT riêng cho ứng dụng
    const accessToken = this.jwt.sign(
      { username: user.username, role: user.role },
      { expiresIn: "1m" }
    );

    const refreshToken = this.jwt.sign(
      { username: user.username, role: user.role },
      { expiresIn: "7d" }
    );

    // Lưu refreshToken riêng của app vào DB
    await this.mongo.db
      .collection("users")
      .updateOne({ sub: user.sub }, { $set: { refreshToken } });

    // Gửi về client qua cookie
    rep.cookie("accessToken", accessToken, {
      httpOnly: true,
      path: "/",
    });
    rep.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/",
    });

    // console.log("info id_token", googleUser);

    // // Lưu thông tin user vào session (nếu dùng session)
    // req.session.user = {
    //   id: user._id,
    //   name: user.name,
    //   email: user.email,
    //   picture: user.picture,
    // };

    // Gán cookie token cho client (tuỳ chọ

    // Chuyển hướng về trang chủ hoặc trang bạn muốn
    return rep.redirect("/");
  });
};
