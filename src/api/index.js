// api/index.js

async function api(fastifyApp, options) {
  fastifyApp.register(require("./home"));
  fastifyApp.register(require("./dashboard"));
  fastifyApp.register(require("./list-category"));
  fastifyApp.register(require("./login"));
  fastifyApp.register(require("./register"));
  fastifyApp.register(require("./member"));
  fastifyApp.register(require("./auth-google"));
  fastifyApp.register(require("./item"));
}

module.exports = api;
