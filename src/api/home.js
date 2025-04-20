function home(fastifyApp, option, done) {
  fastifyApp.get("/", async function (req, rep) {
    const theloai = await this.mongo.db
      .collection("Category")
      .find({})
      .toArray();
    rep.render("home", { theloai });

    return rep;
  });
  done();
}

module.exports = home;
