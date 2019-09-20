const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Post = require("./models/post");

const app = express();

mongoose
	.connect(
		"mongodb+srv://nrehder:gcM3KzVFTpWhlVQ7@cluster0-czeul.mongodb.net/node-angular?retryWrites=true&w=majority",
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
	.then(() => {
		console.log("connected to database!");
	})
	.catch(err => {
		console.log("Connection failed!");
		if (err) console.log(err);
	});

app.use(bodyParser.json());

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
	const post = new Post({
		title: req.body.title,
		content: req.body.content,
	});
	post.save().then(result => {
		res.status(201).json({
			message: "Post added successfully!",
			id: result._id,
		});
	});
});

app.get("/api/posts", (req, res, next) => {
	Post.find()
		.then(docs => {
			res.status(200).json({
				message: "Posts fetched successfully!",
				posts: docs,
			});
		})
		.catch(err => {
			console.log(err);
			res.status(404).json({ error: err });
		});
});

app.delete("/api/posts/:id", (req, res, next) => {
	Post.deleteOne({ _id: req.params.id })
		.then(response => {
			res.status(200).json({ message: "Post deleted!" });
		})
		.catch(err => {
			console.log(err);
		});
});

module.exports = app;
