module.exports = async function (fastifyApp, options) {
  function removeAccents(str) {
    return str
      .normalize("NFD") // Tách các ký tự có dấu thành tổ hợp ký tự không dấu + dấu
      .replace(/[\u0300-\u036f]/g, ""); // Loại bỏ dấu
  }

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

  // router(post/admin/create-item): create a new item
  fastifyApp.post("/dashboard/add-item", async function (req, rep) {
    try {
      //   await pump(
      //     req.body.imgavt.toBuffer(),
      //     fs.createWriteStream(
      //       path.join(__dirname, "public/avt-item", req.body.imgavt.filename)
      //     )
      //   );
      // save req.body --> mongodb studentdb
      const slug = createSlug(req.body.itemname.value);
      const item = await this.mongo.db.collection("Libary").insertOne({
        itemname: req.body.itemname.value,
        slug: slug,
        theloai: req.body.theloai.value,
        tacgia: req.body.tacgia.value,
        trangthai: req.body.trangthai.value,
        noidung: req.body.noidung.value,
        // imgavt: req.body.imgavt.filename,
        createdDate: Date.now(),
      });

      rep.redirect("/dashboard");
    } catch (err) {
      rep.send(err);
    }
  });

  fastifyApp.get("/dashboard/update/:id", async function (req, rep) {
    const user = await this.mongo.db
      .collection("users")
      .findOne({ _id: new ObjectId(req.params.id) });
    return rep.render("dashboard/dashboard", {
      user,
      partial: "update-item",
    });
  });

  fastifyApp.post("/dashboard/update/:id", async function (req, rep) {
    const result = await this.mongo.db.collection("users").updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          role: req.body.role,
        },
      }
    );
    rep.redirect("/dashboard");
  });

  fastifyApp.get("/dashboard/delete/:id", async function (req, rep) {
    const result = await this.mongo.db
      .collection("users")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    rep.redirect("/dashboard");
  });
};
