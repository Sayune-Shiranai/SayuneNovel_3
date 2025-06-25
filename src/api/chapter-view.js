module.exports = async function (fastifyApp, options) {
  fastifyApp.get(
    "/truyen/:slug/chapter-:chapter_number",
    async function (req, rep) {
      const chapter = await this.mongo.db.collection("Chapters").findOne({
        chapter_number: req.params.chapter_number,
        item_id: req.params.slug,
      });

      const theloai = await this.mongo.db
        .collection("Category")
        .find({})
        .toArray();

      const item = await this.mongo.db
        .collection("Libary")
        .findOne({ slug: req.params.slug });

      const user = req.user || null;

      rep.render("index", { chapter, item, theloai, user, partial: "chapter" });

      return rep;
    }
  );
};
