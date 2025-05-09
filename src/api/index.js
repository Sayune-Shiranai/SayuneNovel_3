// api/index.js

async function api(fastifyApp, options) {
  fastifyApp.register(require("./home"));
  fastifyApp.register(require("./dashboard"));
}

module.exports = api;
