const express = require("express");
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");

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
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    // const post = req.body;
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
      creator: req.userData.userId,
    });
    // console.log(req.userData);
    // return res.status(200).json({});
    post.save().then((createdPost) => {
      //  console.log(createdPost);
      res.status(201).json({
        message: "Post created successfully",
        post: {
          id: createdPost._id,
          title: createdPost.title,
          content: createdPost.content,
          imagePath: createdPost.imagePath,
        },
      });
    });
  }
);

router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    // console.log(req.file);
    let imagePath = req.body.imagPath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator: req.userData.userId,
    });
    console.log(post);
    Post.updateOne(
      { _id: req.params.id, creator: req.userData.userId },
      post
    ).then((updatedPost) => {
      console.log(updatedPost);
      if (updatedPost.modifiedCount > 0) {
        res.status(200).json({ message: "Updated successfully" });
      } else {
        res.status(401).json({ message: "Not authorized to update" });
      }
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

router.delete("/:id", checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(
    (result) => {
      console.log(result);

      if (result.deleteCount > 0) {
        res.status(200).json({ message: "Deleted successfully" });
      } else {
        res.status(401).json({ message: "Not authorized to delete" });
      }
    }
  );
});

module.exports = router;
