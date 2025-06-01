// authority-google.js
module.exports = async function (fastifyApp, opts) {
  fastifyApp.get("/authority-google", async (req, rep) => {
    return { message: "Authority Google route" };
  });
};
