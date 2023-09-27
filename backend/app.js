const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");

const Post = require("./models/post");

const app = express();

mongoose
  .connect(
    `mongodb+srv://umangutkarsh_:32mvsNzFuokQ@mean-project-1.0xnfksw.mongodb.net/posts?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("Connected to database");
  })
  .catch(() => {
    console.log("Connection failed");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, res, next) => {
  // const post = req.body;
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  console.log(post);
  post.save().then((createdPost) => {
    console.log(createdPost);
    res
      .status(201)
      .json({ message: "Post created successfully", postId: createdPost._id });
  });
});

app.get("/api/posts", (req, res, next) => {
  const posts = Post.find().then((documents) => {
    console.log(documents);
    res
      .status(200)
      .json({ message: "Posts fetched successfully", posts: documents });
  });
});

app.delete("/api/posts/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(req.params.id);
    res.status(200).json({ message: "Deleted successfully" });
  });
});

module.exports = app;
