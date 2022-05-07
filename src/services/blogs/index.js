import express from "express";
import createError from "http-errors";
import BlogModel from "./model.js";
import { checkBlogMiddleware, checkVdalidationResult } from "./validation.js";

const blogsRouter = express.Router();

blogsRouter.post(
	"/",
	checkBlogMiddleware,
	checkVdalidationResult,
	async (req, res, next) => {
		console.log("REQUEST BODY: ", req.body);
		try {
			const newBlog = await new BlogModel(req.body);
			const savedBlog = await newBlog.save(); //Save the body in the Users Collection

			res.send(savedBlog);
		} catch (error) {
			next(error);
		}
	}
);

blogsRouter.get("/", async (req, res, next) => {
	try {
		const blog = await BlogModel.find();
		res.send(blog);
	} catch (error) {
		next(error);
	}
});

blogsRouter.get("/:blogId", async (req, res, next) => {
	try {
		const blog = await BlogModel.findById(req.params.blogId);
		if (blog) {
			res.send(blog);
		} else {
			next(createError(404, `Blog with id ${req.params.blogId} not found!`));
		}
	} catch (error) {
		next(error);
	}
});

blogsRouter.put("/:blogId", async (req, res, next) => {
	try {
		const updateBlog = await BlogModel.findByIdAndUpdate(
			req.params.usserId,
			req.body,
			{ new: true }
		);
		if (blog) {
			res.send(updateBlog);
		} else {
			next(createError(404, `Blog with id ${req.params.blogId} not found!`));
		}
	} catch (error) {
		next(error);
	}
});

blogsRouter.delete("/:blogId", async (req, res, next) => {
	try {
		const deleteBlog = await BlogModel.findByIdAndDelete(req.params.blogId);
		if (deleteBlog) {
			res.status(204).send();
		} else {
			next(createError(404, `Blog with id ${req.params.blogId} not found!`));
		}
	} catch (error) {
		next(error);
	}
});

export default blogsRouter;
