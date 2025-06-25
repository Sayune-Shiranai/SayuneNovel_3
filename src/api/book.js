module.exports = async function (fastifyApp, options) {
  //router(get/truyen/:slug): view item
  fastifyApp.get("/truyen/:slug", async function (req, rep) {
    const item = await this.mongo.db
      .collection("Libary")
      .findOne({ slug: req.params.slug });

    const theloai = await this.mongo.db
      .collection("Category")
      .find({})
      .toArray();

    const user = req.user || null;

    // Lấy danh sách chapters theo item_id
    const chapters = await this.mongo.db
      .collection("Chapters")
      .find({
        item_id: req.params.slug,
      })
      .sort({ chapter_number: 1 })
      .toArray();

    rep.render("index", {
      item,
      chapters,
      theloai,
      user,
      partial: "book",
    });

    return rep;
  });
};
