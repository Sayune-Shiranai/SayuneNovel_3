module.exports = async function (fastifyApp, options) {
  function createSlug(itemname) {
    return removeAccents(itemname)
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Loại bỏ các ký tự đặc biệt
      .trim()
      .replace(/\s+/g, "-"); // Thay khoảng trắng bằng dấu gạch ngang
  }

  //router(get/admin/create-item): create item form
  fastifyApp.get("/dashboard/add-item", function (req, rep) {
    return rep.render("dashboard/dashboard", {
      partial: "create-item",
    });
  });

  //router(post/admin/create-item): create a new item
  // fastifyApp.post("/dashboard/add-item", async function (req, rep) {
  //   try {
  //     await pump(
  //       req.body.imgavt.toBuffer(),
  //       fs.createWriteStream(
  //         path.join(__dirname, "public/avt-item", req.body.imgavt.filename)
  //       )
  //     );
  //     // save req.body --> mongodb studentdb
  //     const slug = createSlug(req.body.itemname.value);
  //     const result = await this.mongo.db.collection("libary").insertOne({
  //       itemname: req.body.itemname.value,
  //       slug: slug,
  //       theloai: req.body.theloai.value,
  //       tacgia: req.body.tacgia.value,
  //       noidung: req.body.noidung.value,
  //       imgavt: req.body.imgavt.filename,
  //       createdDate: Date.now(),
  //     });

  //     rep.redirect("/dashboard");
  //   } catch (err) {
  //     rep.send(err);
  //   }
  // });
};
