const Post = require("../models/post");

//get all posts for current page
exports.getMultiplePosts = (req, res, next) => {
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
			res.status(500).json({ message: "Fetching posts failed!" });
		});
};

//get specific post (used for edit post page)
exports.getSinglePost = (req, res, next) => {
	Post.findById(req.params.id)
		.then(post => {
			if (post) {
				res.status(200).json(post);
			} else {
				res(404).json({ message: "Post not found!" });
			}
		})
		.catch(err => {
			res.status(500).json({ message: "Fetching post failed!" });
		});
};

//create a new post
exports.createPost = (req, res, next) => {
	const url = req.protocol + "://" + req.get("host");
	const newPost = new Post({
		title: req.body.title,
		content: req.body.content,
		imagePath: url + "/images/" + req.file.filename,
		creator: req.userData.userId,
	});
	newPost
		.save()
		.then(result => {
			res.status(201).json({ message: "Post added successfully!" });
		})
		.catch(err => {
			res.status(500).json({ message: "Creating a post failed!" });
		});
};

//edit a specific post
exports.editPost = (req, res, next) => {
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
		creator: req.userData.userId,
	});
	Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
		.then(result => {
			if (result.n > 0) {
				res.status(200).json({ message: "Update successful" });
			} else {
				res.status(401).json({ message: "Not Authorized!" });
			}
		})
		.catch(err => {
			res.status(500).json({ message: "Couldn't update post!" });
		});
};

//delete a post
exports.deletePost = (req, res, next) => {
	Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
		.then(result => {
			if (result.n > 0) {
				res.status(200).json({ message: "Post deleted!" });
			} else {
				res.status(401).json({ message: "Not Authorized!" });
			}
		})
		.catch(err => {
			res.status(500).json({ message: "Deleting post failed!" });
		});
};
