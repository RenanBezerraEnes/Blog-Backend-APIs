import express from "express";
import createError from "http-errors";
import BlogModel from "./model.js";
import { checkBlogMiddleware, checkVdalidationResult } from "./validation.js";
import query2Mongo from "query-to-mongo";
// import res from "express/lib/response";

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
		console.log("MONGO QUERY -->", query2Mongo(req.query));

		const mongoQuery = query2Mongo(req.query);

		const total = await BlogModel.countDocuments(mongoQuery.criteria);

		if (!mongoQuery.options.skip) mongoQuery.options.skip = 0;

		if (!mongoQuery.options.limit || mongoQuery.options.limit > 10)
			mongoQuery.options.limit = 20;

		const blog = await BlogModel.find(
			mongoQuery.criteria,
			mongoQuery.options.fields
		)
			.skip(mongoQuery.options.skip)
			.limit(mongoQuery.options.limit)
			.sort(mongoQuery.options.sort)
			.populate("author");
		res.send({
			links: mongoQuery.links(`${process.env.Blogs_API}/blogPosts`, total),
			total,
			totalPages: Math.ceil(total / mongoQuery.options.limit),
			blog,
		});
	} catch (error) {
		next(error);
	}
});

blogsRouter.get("/:blogId", async (req, res, next) => {
	try {
		const blog = await BlogModel.findById(req.params.blogId).populate("author");
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

// ********************************************** BOOKS COMMENTS ************************************************************

blogsRouter.post("/comments/:blogId", async (req, res, next) => {
	try {
		const commentsUpdate = await BlogModel.findByIdAndUpdate(
			req.params.blogId,
			{
				$push: { comments: { ...req.body, commentDate: new Date() } },
			},
			{ new: true }
		);
		console.log(commentsUpdate);
		if (commentsUpdate) {
			res.send(commentsUpdate);
		} else {
			next(createError(404, `Blog with id ${req.params.blogId} not found!`));
		}
	} catch (error) {
		next(error);
	}
});

blogsRouter.get("/comments/:blogId", async (req, res, next) => {
	try {
		const blogs = await BlogModel.findById(req.params.blogId);
		if (blogs) {
			res.send(blogs.comments);
		} else {
			next(createError(404, `Blog with id ${req.params.blogId} not found!`));
		}
	} catch (error) {
		next(error);
	}
});

blogsRouter.get("/:blogId/comments/:commentId", async (req, res, next) => {
	try {
		const getComments = await BlogModel.findById(req.params.blogId);
		if (getComments) {
			const comment = getComments.comments.find(
				(comment) => comment._id.toString() === req.params.commentId
			);
			if (comment) {
				res.send(comment);
			} else {
				next(
					createError(404, `Comment with id ${req.params.blogId} not found!`)
				);
			}
		} else {
			next(createError(404, `Comment with id ${req.params.blogId} not found!`));
		}
	} catch (error) {
		next(error);
	}
});

blogsRouter.put("/:blogId/comments/:commentId", async (req, res, next) => {
	try {
	} catch (error) {
		next(error);
	}
});

blogsRouter.delete("/:blogId/comments/:commentId", async (req, res, next) => {
	try {
	} catch (error) {
		next(error);
	}
});

export default blogsRouter;
