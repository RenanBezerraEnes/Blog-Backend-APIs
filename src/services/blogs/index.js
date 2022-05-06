import express from "express";
import BlogModel from "./model.js";

const blogsRouter = express.Router();

blogsRouter.post("/", async (req, res) => {
	console.log("REQUEST BODY: ", req.body);
	try {
		const newBlog = await new BlogModel(req.body);
		const savedBlog = await newBlog.save(); //Save the body in the Users Collection

		res.send(savedBlog);
	} catch (error) {
		console.log(error);
	}
});

blogsRouter.get("/", async (req, res) => {
	const blog = await BlogModel.find();

	res.send(blog);
});

blogsRouter.get("/:blogId", async (req, res) => {
	const blog = await BlogModel.findById(req.params.blogId);

	res.send(blog);
});

blogsRouter.put("/:blogId", async (req, res) => {
	const updateBlog = await BlogModel.findByIdAndUpdate(
		req.params.usserId,
		req.body,
		{ new: true }
	);

	res.send(updateBlog);
});

blogsRouter.delete("/:blogId", async (req, res) => {
	await BlogModel.findByIdAndDelete(req.params.blogId);
	res.status(204).send();
});

export default blogsRouter;
