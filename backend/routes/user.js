const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

router.post("/signup", (req, res, next) => {
	bcrypt.hash(req.body.password, 10).then(hash => {
		const user = new User({
			email: req.body.email,
			password: hash,
		});
		user.save()
			.then(result => {
				res.status(201).json({
					message: "user created",
					result,
				});
			})
			.catch(err => {
				res.status(500).json({
					message: "User already exists!",
				});
			});
	});
});

router.post("/login", (req, res, next) => {
	let fetchedUser;
	User.findOne({ email: req.body.email })
		.then(user => {
			if (!user) {
				return res
					.status(401)
					.json({ message: "Email or password was incorrect!" });
			}

			fetchedUser = user;
			return bcrypt.compare(req.body.password, user.password);
		})
		.then(result => {
			if (!result) {
				return res
					.status(401)
					.json({ message: "Email or password was incorrect!" });
			}
			const token = jwt.sign(
				{
					email: fetchedUser.email,
					userId: fetchedUser._id,
				},
				"secret_this_should_be_longer",
				{ expiresIn: "1h" }
			);
			res.status(200).json({
				token,
				expiresIn: 3600000,
				userId: fetchedUser._id,
			});
		})
		.catch(err => {
			res.status(401).json({
				message: "Invalid authentication credentials!",
			});
		});
});

module.exports = router;
