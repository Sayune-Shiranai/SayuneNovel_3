//src/api/member.js
module.exports = async function (fastifyApp, options) {
  fastifyApp.get("/member", function (req, rep) {
    rep.render("dashboard/member");
  });
};
