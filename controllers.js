// TODO: FIX TO AND FROM

const { raw } = require("body-parser");
const e = require("cors");
const { default: mongoose } = require("mongoose");
const { User, Exercise } = require("./models");

const createUser = async (req, res) => {
	try {
		let user = await User.findOne({ username: req.body.username });
		if (user) {
			res.status(400).send({ message: "username taken, pick another" });
			return;
		}
		user = await User.create({ username: req.body.username });
		res.status(200).send(user);
	} catch (err) {
		res.send(err);
	}
};

const createExercise = async (req, res) => {
	try {
		const userId = mongoose.Types.ObjectId(req.params._id);
		const user = await User.findById(userId);
		if (!user) {
			res.status(400).send({ message: "User not found." });
			return;
		}

		const date = req.body.date ? new Date(req.body.date) : new Date();

		const exercise = await Exercise.create({
			description: req.body.description,
			date: date.toDateString(),
			duration: req.body.duration,
			_user_id: userId,
		});

		res.status(200).send({
			_id: user._id,
			username: user.username,
			description: exercise.description,
			date: exercise.date,
			duration: exercise.duration,
		});
	} catch (err) {
		res.send(err);
	}
};

const getAllUsers = async (req, res) => {
	try {
		const users = await User.find({});
		res.status(200).send(users);
	} catch (err) {
		res.send(err);
	}
};

const getAllExercises = async (req, res) => {
	try {
		const userId = req.params._id;
		const user = await User.findById(userId);
		if (!user) {
			res.status(400).send({ message: "User not found." });
			return;
		}

		let rawExercises = await Exercise.find({
			_user_id: mongoose.Types.ObjectId(userId),
		});

		if (req.query.from) {
			// Match from with 'yyyy-mm-dd'
			if (!req.query.from.match(/^\d{4}-\d{1,2}-\d{1,2}$/)) {
				res.send({
					message:
						"Invalid from parameter, make sure it is in the form yyyy-mm-dd",
				});
				return;
			}

			const refDate = new Date(`${req.query.from} 00:00:00`);
			for (let i = 0; i < rawExercises.length; i++) {
				const exDate = new Date(rawExercises[i].date);
				if (exDate < refDate) {
					rawExercises.splice(i, 1);
					i--;
				}
			}
		}

		if (req.query.to) {
			// Match to with 'yyyy-mm-dd'
			if (!req.query.to.match(/^\d{4}-\d{1,2}-\d{1,2}$/)) {
				res.send({
					message:
						"Invalid to parameter, make sure it is in the form yyyy-mm-dd",
				});
				return;
			}

			const refDate = new Date(`${req.query.to} 00:00:00`);
			for (let i = 0; i < rawExercises.length; i++) {
				const exDate = new Date(rawExercises[i].date);
				if (exDate > refDate) {
					rawExercises.splice(i, 1);
					i--;
				}
			}
		}

		if (req.query.limit) {
			const limit = parseInt(req.query.limit);
			while (rawExercises.length > limit) rawExercises.pop();
		}

		let exercises = [];

		for (let i = 0; i < rawExercises.length; i++) {
			exercises[i] = {
				description: rawExercises[i].description,
				duration: rawExercises[i].duration,
				date: rawExercises[i].date,
			};
		}

		res.status(200).send({
			_id: user._id,
			username: user.username,
			count: exercises.length,
			log: exercises,
		});
	} catch (err) {
		res.send(err);
	}
};

module.exports = { createUser, createExercise, getAllUsers, getAllExercises };
