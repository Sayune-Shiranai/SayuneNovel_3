const { ObjectId } = require("@fastify/mongodb");
const path = require("node:path");
const fs = require("node:fs");
const util = require("node:util");
const { pipeline } = require("node:stream");
const pump = util.promisify(pipeline);

module.exports = async function (fastifyApp, options) {
  //router(get/dashboard/:slug): return list chapter
  fastifyApp.get("/dashboard/:slug", async function (req, rep) {
    const chapters = await this.mongo.db
      .collection("Chapters")
      .find({ item_id: req.params.slug })
      .sort({ chapter_number: 1 })
      .toArray();

    return rep.render("dashboard/dashboard", {
      chapters,
      slug: req.params.slug,
      partial: "chapters",
    });
  });

  //router(get/dashboard/:slug/add-chapter): create a chapter form
  fastifyApp.get("/dashboard/:slug/add-chapter", function (req, rep) {
    // const chapters = await this.mongo.db
    //   .collection("Chapters")
    //   .findOne({ item_id: req.params.slug })
    console.log("slug", req.params.slug);
    return rep.render("dashboard/dashboard", {
      slug: req.params.slug,
      partial: "add-chapter",
    });
  });

  //router(post/dashboard/:slug/add-chapter): create a chapter
  fastifyApp.post("/dashboard/:slug/add-chapter", async function (req, rep) {
    const libary = await this.mongo.db
      .collection("Libary")
      .findOne({ slug: req.params.slug });

    if (!libary) {
      return rep.status(404).send({ message: "Truyện không tìm thấy!" });
    }

    const chapterPath = path.join(
      __dirname,
      `../../public/truyen/${libary.slug}/chapter-${req.body.chapter_number.value}`
    );

    try {
      if (fs.existsSync(chapterPath)) {
        fs.rmSync(chapterPath, { recursive: true });
        fs.mkdirSync(chapterPath, { recursive: true });
      } else {
        fs.mkdirSync(chapterPath, { recursive: true });
      }

      const files = await req.saveRequestFiles();
      const imageUrls = [];

      for (const file of files) {
        console.log(`Đã tải lên: ${file.filename}`);
        console.log(`Đường dẫn file tạm thời: ${file.filepath}`);

        const targetPath = path.join(chapterPath, file.filename);
        // Sao chép file vào thư mục mới
        fs.copyFileSync(file.filepath, targetPath);
        // Xóa file gốc
        fs.unlinkSync(file.filepath);

        imageUrls.push(
          `../../public/truyen/${libary.slug}/chapter-${req.body.chapter_number.value}/${file.filename}`
        );
      }

      imageUrls.sort((a, b) => {
        const getNumber = (filename) =>
          parseInt(filename.match(/\d+/)?.[0] || 0);
        return getNumber(a) - getNumber(b);
      });

      if (imageUrls.length === 0) {
        return rep.status(400).send({ message: "Không có file nào được lưu." });
      }

      await this.mongo.db.collection("Chapters").insertOne({
        item_id: libary.slug,
        chapter_number: req.body.chapter_number.value,
        name_chapter: req.body.name_chapter.value,
        content: imageUrls,
      });

      rep.redirect(`/dashboard/${libary.slug}`);
    } catch (error) {
      console.error("Error during file upload:", error);
      rep
        .status(500)
        .send({ message: "Đã xảy ra lỗi trong quá trình tải lên." });
    }
  });

  //router(get/dashboard/:slug/delete/:id): delete a chapter
  fastifyApp.get("/dashboard/:slug/delete/:id", async function (req, rep) {
    try {
      const chapter = await this.mongo.db
        .collection("Chapters")
        .findOne({ _id: new ObjectId(req.params.id) });

      // Tìm libary theo item_id của chapter để lấy slug
      const libary = await this.mongo.db
        .collection("Libary")
        .findOne({ slug: chapter.item_id });

      const result = await this.mongo.db
        .collection("Chapters")
        .deleteOne({ _id: new ObjectId(req.params.id) });

      rep.redirect(`/dashboard/${libary.slug}`);
    } catch (error) {
      rep.status(500).send({ message: "Lỗi khi xóa chapter." });
    }
  });
};
