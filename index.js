require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
mongoose.set("strictQuery", true); //To suppress some dumbass warning
const bodyParser = require("body-parser");
const {
	createUser,
	createExercise,
	getAllUsers,
	getAllExercises,
} = require("./controllers");

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(
	bodyParser.urlencoded({
		limit: "5000mb",
		extended: true,
		parameterLimit: 100000000000,
	})
);

// Endpoints

// POST to '/api/users' to create new user, returns {username, _id}
// GET  to '/api/users' to get all users, returns an array of objects with {username, _id}
// POST to '/api/users/:_id/exercises' to create exercise from form, if !date, date = now,
//                                      returns user object with the exercise fields added
// GET  to '/api/users/:_id/logs' to retrieve a full exercise log of any user
//            returns a user object with {count, log[{description(String), duration(Number), date(String .dateString())}(of all exercises)]}
/*
  You can add from, to and limit parameters to a GET /api/users/:_id/logs request
  to retrieve part of the log of any user.
  {from, to} are dates in 'yyyy-mm-dd' format.
  {limit} is integer of how many logs to send back.
*/

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", createUser);
app.get("/api/users", getAllUsers);
app.post("/api/users/:_id/exercises", createExercise);
app.get("/api/users/:_id/exercises", getAllExercises);


const start = async () => {
	try {
		mongoose.connect(process.env.MONGO_URI);
		app.listen(PORT, () => {
			console.log(`App listening on port ${PORT}`);
		});
	} catch (error) {
		console.log(error);
	}
};

start();
