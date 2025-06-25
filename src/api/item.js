const { ObjectId } = require("@fastify/mongodb");
const path = require("node:path"); // giúp xử lý và thao tác với đường dẫn file @fastify/static
const fs = require("node:fs"); //Quản lý file trong Node.js
const util = require("node:util"); //Cung cấp công cụ hỗ trợ, như promisify
const { pipeline } = require("node:stream"); //	Lấy function pipeline từ module stream, dùng để xử lý luồng dữ liệu (stream).
const pump = util.promisify(pipeline); // Chuyển pipeline từ callback-based thành Promise-based để dễ sử dụng với async/await.

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

  //router(get/dashboard/add-item): create item form
  fastifyApp.get("/dashboard/add-item", async function (req, rep) {
    const categories = await this.mongo.db
      .collection("Category")
      .find({})
      .toArray();
    return rep.render("dashboard/dashboard", {
      categories,
      partial: "create-item",
    });
  });

  // router(post/dashboard/add-item): create a new item
  fastifyApp.post("/dashboard/add-item", async function (req, rep) {
    try {
      await pump(
        req.body.imgavt.toBuffer(),
        fs.createWriteStream(
          path.join(
            __dirname,
            "../../public/avt-item",
            req.body.imgavt.filename
          )
        )
      );

      let theloai = [];
      const checktheloai = req.body["theloai[]"];

      if (Array.isArray(checktheloai)) {
        for (const t of checktheloai) {
          // if t != null && t!= undefined ? return t.value : return undefined
          if (t?.value) {
            theloai.push(t.value);
          }
        }
      } else if (checktheloai?.value) {
        theloai.push(checktheloai.value);
      }

      console.log("fields.theloai", checktheloai);
      console.log("theloai", theloai);
      // save req.body --> mongodb studentdb
      const slug = createSlug(req.body.itemname.value);
      const item = await this.mongo.db.collection("Libary").insertOne({
        id: req.body.id.value,
        itemname: req.body.itemname.value,
        slug: slug,
        imgavt: req.body.imgavt.filename,
        theloai: theloai,
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

  // router(get/dashboard/update/:id): update a item form
  fastifyApp.get("/dashboard/update/:id", async function (req, rep) {
    const categories = await this.mongo.db
      .collection("Category")
      .find({})
      .toArray();
    const item = await this.mongo.db
      .collection("Libary")
      .findOne({ _id: new ObjectId(req.params.id) });

    console.log("item", item.theloai);
    return rep.render("dashboard/dashboard", {
      categories,
      item,
      partial: "update-item",
    });
  });

  // router(post/dashboard/update/:id): update a item form
  fastifyApp.post("/dashboard/update/:id", async function (req, rep) {
    try {
      let imgavt;

      const oldImagePath = path.join(
        __dirname,
        `../../public/avt-item/` + req.body.oldImgavt.value
      );
      console.log("oldImagePath", oldImagePath);

      if (req.body.imgavt && req.body.imgavt.filename) {
        await pump(
          req.body.imgavt.toBuffer(),
          fs.createWriteStream(
            path.join(
              __dirname,
              "../../public/avt-item",
              req.body.imgavt.filename
            )
          )
        );

        // Kiểm tra tồn tại tệp cũ trước khi xóa
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }

        imgavt = req.body.imgavt.filename;
      } else if (req.body.deleteImg.value === "true") {
        console.log("deleteImg", req.body.deleteImg);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          imgavt = " ";
        }
      } else {
        imgavt = req.body.oldImgavt.value;
        console.log("oldImgavt:", req.body.oldImgavt.value);
      }

      let theloai = [];
      const checktheloai = req.body["theloai[]"];

      if (Array.isArray(checktheloai)) {
        for (const t of checktheloai) {
          // if t != null && t!= undefined ? return t.value : return undefined
          if (t?.value) {
            theloai.push(t.value);
          }
        }
      } else if (checktheloai?.value) {
        theloai.push(checktheloai.value);
      }

      const slug = createSlug(req.body.itemname.value);
      await this.mongo.db.collection("Libary").updateOne(
        { _id: new ObjectId(req.params.id) },
        {
          $set: {
            id: req.body.id.value,
            itemname: req.body.itemname.value,
            slug: slug,
            imgavt: imgavt,
            theloai: theloai,
            tacgia: req.body.tacgia.value,
            trangthai: req.body.trangthai.value,
            noidung: req.body.noidung.value,
          },
        }
      );

      rep.redirect("/dashboard");
    } catch (err) {
      console.error(err);
      rep.send({ error: "Lỗi khi cập nhật mục", message: err.message });
    }
  });

  fastifyApp.get("/dashboard/delete/:id", async function (req, rep) {
    const item = await this.mongo.db
      .collection("Libary")
      .fineOne({ _id: new ObjectId(req.params.id) });

    if (item.imgavt && item.imgavt.trim() !== "") {
      const imgPath = path.join(
        __dirname,
        "../../public/avt-item",
        item.imgavt
      );
      // Kiểm tra ảnh có tồn tại không, rồi xoá
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    }

    // Sau đó xoá khỏi MongoDB
    await this.mongo.db
      .collection("Libary")
      .deleteOne({ _id: new ObjectId(req.params.id) });

    rep.redirect("/dashboard");
  });
};
