const express = require("express");
const multer = require("multer");

const Post = require("../models/post");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    console.log(file);
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, fileName + "-" + Date.now() + "." + ext);
  },
});

router.post(
  "/",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    // const post = req.body;
    const url = req.protocol + "://" + req.get("host");
    let fetchedPosts;
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
    });
    console.log(post);
    post
      .save()
      .then((createdPost) => {
        //  console.log(createdPost);
        fetchedPosts = createdPost;
        return Post.count();
      })
      .then((count) => {
        res.status(201).json({
          message: "Post created successfully",
          post: {
            id: fetchedPosts._id,
            title: fetchedPosts.title,
            content: fetchedPosts.content,
            imagePath: fetchedPosts.imagePath,
          },
          maxPosts: count,
        });
      });
  }
);

router.put(
  "/:id",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    // console.log(req.file);
    let imagePath = req.body.imagPath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    let fetchedPosts;
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
    });
    // console.log(post);
    Post.updateOne({ _id: req.params.id }, post).then((updatedPost) => {
      console.log(updatedPost);
      fetchedPosts = updatedPost;
      res.status(200).json({ message: "Updated successfully" });
    });
  }
);

router.get("/", (req, res, next) => {
  console.log(req.query);
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.pageIndex;
  let fetchedPosts;
  if (pageSize && currentPage) {
    Post.find()
      .skip(pageSize * currentPage)
      .limit(pageSize);
  }
  Post.find()
    .then((documents) => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Posts fetched successfully",
        posts: fetchedPosts,
        maxPosts: count,
      });
    });
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  });
});

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(req.params.id);
    res.status(200).json({ message: "Deleted successfully" });
  });
});

module.exports = router;
