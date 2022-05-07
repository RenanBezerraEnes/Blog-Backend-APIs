import express from "express";
import UsersModel from "./model.js";
import createError from "http-errors";
import { checkUserMiddleware, checkVdalidationResult } from "./validation.js";

const usersRouter = express.Router();

usersRouter.post(
	"/",
	checkUserMiddleware,
	checkVdalidationResult,
	async (req, res, next) => {
		console.log("REQUEST BODY: ", req.body);
		try {
			const newUser = new UsersModel(req.body);
			const savedUser = await newUser.save();

			res.send(savedUser);
		} catch (error) {
			next(error);
		}
	}
);

usersRouter.get("/", async (req, res, next) => {
	try {
		const users = await UsersModel.find();
		res.send(users);
	} catch (error) {
		next(error);
	}
});

usersRouter.get("/:userId", async (req, res, next) => {
	try {
		const user = await UsersModel.findById(req.params.userId);
		if (user) {
			res.send(user);
		} else {
			next(createError(404, `User with id ${req.params.userId} not found`));
		}
	} catch (error) {
		next(error);
	}
});

usersRouter.put("/:userId", async (req, res, next) => {
	try {
		const updateUser = await UsersModel.findByIdAndUpdate(
			req.params.userId,
			req.body,
			{ new: true }
		);
		if (updateUser) {
			res.send(updateUser);
		} else {
			next(createError(404, `User with id ${req.params.userId} not found`));
		}
	} catch (error) {
		next(error);
	}
});

usersRouter.delete("/:userId", async (req, res, next) => {
	try {
		const deleteUser = await UsersModel.findByIdAndDelete(req.params.userId);
		if (deleteUser) {
			res.status(204).send();
		} else {
			next(createError(404, `Blog with id ${req.params.blogId} not found!`));
		}
	} catch (error) {
		next(error);
	}
});

export default usersRouter;
