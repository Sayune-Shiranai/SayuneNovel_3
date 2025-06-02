// // plugins/pluginAuthGoogle.js
// const oauthPlugin = require("@fastify/oauth2");

// module.exports = async function (fastifyApp, options) {
//   await fastifyApp.register(oauthPlugin, {
//     name: "googleOAuth2",
//     scope: ["openid", "email", "profile"],
//     credentials: {
//       client: {
//         id: fastifyApp.config.GOOGLE_CLIENT_ID,
//         secret: fastifyApp.config.GOOGLE_CLIENT_SECRET,
//       },
//       auth: oauthPlugin.GOOGLE_CONFIGURATION,
//     },
//     startRedirectPath: "/login/google",
//     callbackUri: "http://127.0.0.1:3000/login/google/callback",
//     callbackUriParams: {
//       access_type: "offline",
//     },
//     pkce: "S256",
//   });

//   // Nếu bạn có file route tách riêng cho callback thì:
//   //   await fastifyApp.register(require("../api/auth-google"), {
//   //     clientId: fastifyApp.config.GOOGLE_CLIENT_ID,
//   //   });
// };
