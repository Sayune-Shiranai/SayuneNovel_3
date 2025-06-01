// services/services.js

async function services(fastifyApp, options) {
  // fastifyApp.register(require("./auth"));
  // fastifyApp.register(require("./authority"));
  fastifyApp.register(require("./authority-google"));
}

module.exports = services;
