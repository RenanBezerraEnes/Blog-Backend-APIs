import express from "express";
import UsersModel from "./model.js";

const usersRouter = express.Router();

usersRouter.post("/", async (req, res) => {
	console.log("REQUEST BODY: ", req.body);

	const newUser = new UsersModel(req.body);
	const savedUser = await newUser.save(); //Save the body in the Users Collection

	res.send(savedUser);
});

usersRouter.get("/", async (req, res) => {
	const users = await UsersModel.find();

	res.send(users);
});

usersRouter.get("/:userId", async (req, res) => {
	const user = await UsersModel.findById(req.params.userId);

	res.send(user);
});

usersRouter.put("/:userId", async (req, res) => {
	const updateUser = await UsersModel.findByIdAndUpdate(
		req.params.userId,
		req.body,
		{ new: true }
	);

	res.send(updateUser);
});

usersRouter.delete("/:userId", async (req, res) => {
	await UsersModel.findByIdAndDelete(req.params.userId);
	res.status(204).send();
});

export default usersRouter;
