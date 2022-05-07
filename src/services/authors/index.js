import express from "express";
import AuthorsModel from "./model.js";
import createError from "http-errors";
import { checkAuthorMiddleware, checkVdalidationResult } from "./validation.js";

const authorsRouter = express.Router();

authorsRouter.post(
	"/",
	checkAuthorMiddleware,
	checkVdalidationResult,
	async (req, res) => {
		try {
			const newAuthor = new AuthorsModel(req.body);
			const savedAuthor = await newAuthor.save();

			res.send(savedAuthor);
		} catch (error) {
			next(error);
		}
	}
);

authorsRouter.get("/", async (req, res) => {
	try {
		const authors = await AuthorsModel.find();
		res.send(authors);
	} catch (error) {
		next(error);
	}
});

authorsRouter.get("/:authorId", async (req, res) => {
	try {
		const author = await AuthorsModel.findById(req.params.authorId);
		if (author) {
			res.send(author);
		} else {
			next(createError(404`User with id ${req.params.userId} not found`));
		}
	} catch (error) {
		next(error);
	}
});

authorsRouter.put("/:authorId", async (req, res) => {
	try {
		const updateAuthor = await AuthorsModel.findByIdAndUpdate(
			req.params.authorId,
			req.body,
			{ new: true }
		);
		if (updateAuthor) {
			res.send(updateAuthor);
		} else {
			next(createError(404`User with id ${req.params.userId} not found`));
		}
	} catch (error) {
		next(error);
	}
});

authorsRouter.delete("/:authorId", async (req, res) => {
	try {
		const deleteAuthors = await AuthorsModel.findByIdAndDelete(
			req.params.authorId
		);
		if (deleteAuthors) {
			res.status(204).send();
		} else {
			next(createError(404`User with id ${req.params.userId} not found`));
		}
	} catch (error) {
		next(error);
	}
});

export default authorsRouter;
