//src/apt/search-suggest
module.exports = async function (fastifyApp, options) {
  fastifyApp.get("/api/search-suggest", async function (req, rep) {
    const keyword = req.query.keyword?.trim();

    console.log("Keyword:", keyword);

    if (!keyword) return rep.send([]);

    const results = await fastifyApp.mongo.db
      .collection("Libary")
      .find({ ten: { $regex: keyword, $options: "i" } })
      .project({ itemname: 1, slug: 1, _id: 0 })
      .limit(5)
      .toArray();

    console.log("Matched results:", results); // <== Thêm dòng này
    rep.send(results);
  });
};
