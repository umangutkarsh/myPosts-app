const Post = require("../models/post");

exports.createPost = (req, res, next) => {
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
  post
    .save()
    .then((createdPost) => {
      //  console.log(createdPost);
      res.status(201).json({
        message: "Post created successfully",
        post: {
          ...createdPost,
          id: createdPost._id,
        },
      });
    })
    .catch((error) => {
      res.status(500).json({ message: "Could not add post" });
    });
};

exports.updatePost = (req, res, next) => {
  // console.log(req.file);
  let imagePath = req.body.imagePath;
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
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then((updatedPost) => {
      console.log(updatedPost);
      if (updatedPost.modifiedCount > 0) {
        res.status(200).json({ message: "Updated successfully" });
      } else {
        res.status(401).json({ message: "Not authorized to update" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Could not update post",
      });
    });
};

exports.getPosts = (req, res, next) => {
  console.log(req.query);
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
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
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching posts failed",
      });
    });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching post failed",
      });
    });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((result) => {
      console.log(result);

      if (result.deleteCount > 0) {
        res.status(200).json({ message: "Deleted successfully" });
      } else {
        res.status(401).json({ message: "Not authorized to delete" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Deleting post failed",
      });
    });
};
