const bodyParser = require("body-parser");
const express = require("express");

const app = express();

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
  const post = req.body;
  console.log(post);
  console.log(post);
  res
    .status(201)
    .json({ message: "Post created successfully", createdPost: post });
});

app.get("/api/posts", (req, res, next) => {
  const posts = [
    { id: "23442423", title: "Post 1", content: "Nice posts you are yayyyy" },
    {
      id: "4834234",
      title: "Post 2",
      content: "Nice posts you are also if you know",
    },
  ];

  res.status(200).json({ message: "Posts fetched successfully", posts: posts });
});

module.exports = app;
