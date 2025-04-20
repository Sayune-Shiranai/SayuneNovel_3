const path = require("node:path"); // giúp xử lý và thao tác với đường dẫn file @fastify/static
const fs = require("node:fs"); //Quản lý file trong Node.js
const util = require("node:util"); //Cung cấp công cụ hỗ trợ, như promisify
const { pipeline } = require("node:stream"); //	Lấy function pipeline từ module stream, dùng để xử lý luồng dữ liệu (stream).
const pump = util.promisify(pipeline); // Chuyển pipeline từ callback-based thành Promise-based để dễ sử dụng với async/await.
const { createHmac, randomBytes } = require("node:crypto");
const { ObjectId } = require("@fastify/mongodb");
const ejs = require("ejs");

// Require the framework and instantiate it
const fastifyApp = require("fastify")({ logger: true });

fastifyApp.register(require("@fastify/mongodb"), {
  // force to close the mongodb connection when app stopped
  // the default value is false
  forceClose: true,
  url: "mongodb://127.0.0.1:27017/SayuneNovel_3",
});

fastifyApp.register(require("@fastify/formbody"));

fastifyApp.register(require("@fastify/multipart"), {
  attachFieldsToBody: true,
});

fastifyApp.register(require("@fastify/view"), {
  engine: {
    ejs: require("ejs"),
  },
  root: "src/app",
  propertyName: "render",
});

fastifyApp.register(require("@fastify/static"), {
  root: path.join(__dirname, "../"),
  prefix: "/src/",
  decorateReply: false, //Không thêm sendFile vào reply
});

fastifyApp.register(require("@fastify/static"), {
  root: path.join(__dirname, "../../public"),
  prefix: "/public/",
});

fastifyApp.register(require("./home"));
fastifyApp.register(require("./login"));
fastifyApp.register(require("./dashboard"));
fastifyApp.register(require("./list-category"));
// Declare a route
// fastifyApp.get("/", function handler(req, rep) {
//   rep.send({ hello: "Framework Fastify" });
// });

// Run the server!
fastifyApp.listen({ port: 3000 }, (err) => {
  if (err) {
    fastifyApp.log.error(err);
    process.exit(1);
  }
});
