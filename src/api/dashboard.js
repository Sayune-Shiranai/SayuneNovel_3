module.exports = async function (fastifyApp, option) {
  fastifyApp.get("/dashboard", async function (req, rep) {
    return rep.render("dashboard/dashboard", {
      partial: "member",
    });
  });
};
