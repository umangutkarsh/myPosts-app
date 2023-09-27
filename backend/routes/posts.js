const express = require("express");

const Post = require("../models/post");

const router = express.Router();

router.post("/", (req, res, next) => {
  // const post = req.body;
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  console.log(post);
  post.save().then((createdPost) => {
    //  console.log(createdPost);
    res
      .status(201)
      .json({ message: "Post created successfully", postId: createdPost._id });
  });
});

router.put("/:id", (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
  });
  Post.updateOne({ _id: req.params.id }, post).then((updatedPost) => {
    console.log(updatedPost);
    res.status(200).json({ message: "Updated successfully" });
  });
});

router.get("/", (req, res, next) => {
  Post.find().then((documents) => {
    console.log(documents);
    res
      .status(200)
      .json({ message: "Posts fetched successfully", posts: documents });
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
