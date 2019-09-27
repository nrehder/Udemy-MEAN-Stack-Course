const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

const app = express();

mongoose
	.connect(
		"mongodb+srv://nrehder:" +
			process.env.MONGO_ATLAS_PW +
			"@cluster0-czeul.mongodb.net/node-angular?retryWrites=true&w=majority",
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

app.use("/images", express.static(path.join("images")));

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PATCH, PUT, DELETE, OPTIONS"
	);
	next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
