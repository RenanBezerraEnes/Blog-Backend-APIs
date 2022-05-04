import express from "express";
import AuthorsModel from "./model.js";

const authorsRouter = express.Router();

authorsRouter.post("/", async (req, res) => {
	const newAuthor = new AuthorsModel(req.body);
	const savedAuthor = await newAuthor.save();

	res.send(savedAuthor);
});

authorsRouter.get("/", async (req, res) => {
	const authors = await AuthorsModel.find();
	res.send(authors);
});

authorsRouter.get("/:authorId", async (req, res) => {
	const author = await AuthorsModel.findById(req.params.authorId);
	res.send(author);
});

authorsRouter.put("/:authorId", async (req, res) => {
	const updateAuthor = await AuthorsModel.findByIdAndUpdate(
		req.params.authorId,
		req.body,
		{ new: true }
	);
	res.send(updateAuthor);
});

authorsRouter.delete("/:authorId", async (req, res) => {
	await AuthorsModel.findByIdAndDelete(req.params.authorId);
	res.status(204).send();
});

export default authorsRouter;
