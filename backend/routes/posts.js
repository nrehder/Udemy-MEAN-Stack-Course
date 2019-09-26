const express = require("express");
const router = express.Router();

const fileStorage = require("../middleware/file-storage");
const checkAuth = require("../middleware/check-auth");

const PostsController = require("../controllers/posts");

//default route = /api/posts
router.get("", PostsController.getMultiplePosts);
router.get("/:id", PostsController.getSinglePost);
router.post("", checkAuth, fileStorage, PostsController.createPost);
router.put("/:id", checkAuth, fileStorage, PostsController.editPost);
router.delete("/:id", checkAuth, PostsController.deletePost);

module.exports = router;
