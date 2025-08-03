"use strict";

var path = require("node:path");

var fs = require("node:fs");

var util = require("node:util");

var _require = require("node:stream"),
    pipeline = _require.pipeline;

var pump = util.promisify(pipeline);

var _require2 = require("@fastify/mongodb"),
    ObjectId = _require2.ObjectId;

var ejs = require("ejs");

var oauthPlugin = require("@fastify/oauth2"); // const fastifySession = require("@fastify/session");
// Require the framework and instantiate it


var fastifyApp = require("fastify")({
  logger: true
});

fastifyApp.register(require("@fastify/mongodb"), {
  // force to close the mongodb connection when app stopped
  // the default value is false
  forceClose: true,
  url: "mongodb://127.0.0.1:27017/SayuneNovel_3"
});
fastifyApp.register(require("@fastify/formbody"));
fastifyApp.register(require("@fastify/multipart"), {
  attachFieldsToBody: true
});
fastifyApp.register(require("@fastify/view"), {
  engine: {
    ejs: require("ejs")
  },
  root: "./src/app",
  propertyName: "render"
});
fastifyApp.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/public/"
});
fastifyApp.register(require("@fastify/static"), {
  root: path.join(__dirname, "src"),
  prefix: "/src/",
  decorateReply: false //Không thêm sendFile vào reply

});
fastifyApp.register(require("@fastify/jwt"), {
  secret: "sayune"
});
fastifyApp.register(require("@fastify/cookie"), {
  secret: "sayuneshiranai",
  hook: "onRequest"
});

require("dotenv").config();

var fastifyEnv = require("@fastify/env");

var schema = {
  type: "object",
  required: ["PORT", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"],
  properties: {
    PORT: {
      type: "string",
      "default": "3000"
    },
    GOOGLE_CLIENT_ID: {
      type: "string"
    },
    GOOGLE_CLIENT_SECRET: {
      type: "string"
    }
  }
};
var options = {
  confKey: "config",
  schema: schema,
  data: process.env
};
fastifyApp.register(fastifyEnv, options).ready(function (err) {
  if (err) console.error(err);
  console.log("config: ", fastifyApp.config); // đúng

  console.log("env: ", fastifyApp.getEnvs()); // đúng
});
fastifyApp.after(function () {
  fastifyApp.register(oauthPlugin, {
    name: "googleOAuth2",
    scope: ["openid", "email", "profile"],
    credentials: {
      client: {
        id: process.env.GOOGLE_CLIENT_ID,
        secret: process.env.GOOGLE_CLIENT_SECRET
      },
      auth: oauthPlugin.GOOGLE_CONFIGURATION
    },
    startRedirectPath: "/login/google",
    callbackUri: "http://127.0.0.1:3000/login/google/callback",
    callbackUriParams: {
      access_type: "offline"
    },
    pkce: "S256"
  });
}); // console.log("GOOGLE_CLIENT_ID: ", process.env.GOOGLE_CLIENT_ID);
// console.log(".GOOGLE_CLIENT_SECRET: ", process.env.GOOGLE_CLIENT_ID);

var api = require("./src/api");

fastifyApp.register(api);

var services = require("./src/services");

fastifyApp.register(services);

var auth = require("./src/services/auth");

var authority = require("./src/services/authority"); // Declare a route
// fastifyApp.get("/", function handler(req, rep) {
//   rep.send({ hello: "Framework Fastify" });
// });
// Run the server!


fastifyApp.listen({
  port: 3000
}, function (err) {
  if (err) {
    fastifyApp.log.error(err);
    process.exit(1);
  }
});