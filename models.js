const mongoose = require("mongoose");
mongoose.set("strictQuery", true); //To suppress some dumbass warning

const userSchema = new mongoose.Schema({
	username: { type: String, required: true },
});
const User = mongoose.model("User", userSchema, "Users");

const exerciseSchema = new mongoose.Schema({
	description: { type: String, required: true },
	duration: { type: Number, required: true },
	date: { type: String, required: true },
	_user_id: { type: mongoose.Types.ObjectId, required: true },
});
const Exercise = mongoose.model("Exercise", exerciseSchema, "Exercises");

module.exports = { User, Exercise };