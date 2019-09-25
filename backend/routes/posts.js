const express = require("express");
const router = express.Router();

const multer = require("multer");
const Post = require("../models/post");
const checkAuth = require("../middleware/check-auth");

const MIME_TYPE_MAP = {
	"image/png": "png",
	"image/jpeg": "jpg",
	"image/jpg": "jpg",
};

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const isValid = MIME_TYPE_MAP[file.mimetype];
		let error = new Error("Invalid mime type");
		if (isValid) {
			error = null;
		}
		cb(error, "backend/images");
	},
	filename: (req, file, cb) => {
		const name = file.originalname
			.toLowerCase()
			.split(" ")
			.join("-");
		const ext = MIME_TYPE_MAP[file.mimetype];
		cb(null, name + "-" + Date.now() + "." + ext);
	},
});

router.get("", (req, res, next) => {
	const pageSize = +req.query.pagesize;
	const currentPage = +req.query.page;
	const postQuery = Post.find();
	let fetchedPosts;

	if (pageSize && currentPage) {
		postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
	}

	postQuery
		.then(docs => {
			fetchedPosts = docs;
			return Post.count();
		})
		.then(count => {
			res.status(200).json({
				message: "Posts fetched successfully!",
				posts: fetchedPosts,
				maxPosts: count,
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ error: err });
		});
});

router.get("/:id", (req, res, next) => {
	Post.findById(req.params.id)
		.then(post => {
			if (post) {
				res.status(200).json(post);
			} else {
				res(404).json({ message: "Post not found!" });
			}
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ error: err });
		});
});

router.post(
	"",
	checkAuth,
	multer({ storage: storage }).single("image"),
	(req, res, next) => {
		const url = req.protocol + "://" + req.get("host");
		const newPost = new Post({
			title: req.body.title,
			content: req.body.content,
			imagePath: url + "/images/" + req.file.filename,
		});
		newPost.save().then(result => {
			res.status(201).json({
				message: "Post added successfully!",
				post: {
					title: newPost.title,
					content: newPost.content,
					imagePath: newPost.imagePath,
					id: newPost._id,
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
		let imagePath = req.body.imagePath;
		if (req.file) {
			const url = req.protocol + "://" + req.get("host");
			imagePath = url + "/images/" + req.file.filename;
		}
		const post = new Post({
			_id: req.body.id,
			title: req.body.title,
			content: req.body.content,
			imagePath,
		});
		Post.updateOne({ _id: req.params.id }, post).then(result => {
			res.status(200).json({ message: "Update successful" });
		});
	}
);

router.delete("/:id", checkAuth, (req, res, next) => {
	Post.deleteOne({ _id: req.params.id })
		.then(response => {
			res.status(200).json({ message: "Post deleted!" });
		})
		.catch(err => {
			console.log(err);
		});
});

module.exports = router;
