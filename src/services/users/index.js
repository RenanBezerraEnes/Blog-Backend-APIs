import express from "express";
import usersModel from "./model.js";

const usersRouter = express.Router();

usersRouter.post("/", async (req, res) => {
	console.log("REQUEST BODY: ", req.body);

	const newUser = new usersModel(red.body);
	const savedUser = await newUser.save(); //Save the body in the Users Collection

	res.send(savedUser);
});

usersRouter.get("/", async (req, res) => {
	const users = await usersModel.find();

	res.send(users);
});

usersRouter.get("/:userId", async (req, res) => {
	const user = await usersModel.findById(req.params.userId);

	res.send(user);
});

usersRouter.put("/:userId", async (req, res) => {
	const updateUser = await usersModel.findByIdAndUpdate(
		req.params.userId,
		req.body,
		{ new: true }
	);

	res.send(updateUser);
});

usersRouter.delete("/:userId", async (req, res) => {
	await usersModel.findByIdAndDelete(req.params.userId);
	res.status(204).send();
});

export default usersRouter;
