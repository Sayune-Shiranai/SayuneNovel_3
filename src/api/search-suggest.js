//src/apt/search-suggest
module.exports = async function (fastifyApp, options) {
  fastifyApp.get("/search-suggest", async function (req, rep) {
    const keyword = req.query.keyword?.trim();

    console.log("Keyword:", keyword);

    if (!keyword) return rep.send([]);

    const item = await this.mongo.db
      .collection("Libary")
      .find({ itemname: { $regex: keyword, $options: "i" } })
      .project({ itemname: 1, slug: 1, _id: 0 })
      .limit(5)
      .toArray();

    console.log("Matched results:", item); // <== Thêm dòng này
    rep.send(item);
  });
};
