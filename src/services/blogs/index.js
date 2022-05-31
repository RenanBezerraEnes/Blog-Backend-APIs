import express from "express";
import createError from "http-errors";
import BlogModel from "./model.js";
import { checkBlogMiddleware, checkVdalidationResult } from "./validation.js";
import query2Mongo from "query-to-mongo";
import { cloudinaryUploader } from "../../lib/cloudiary.js";
import { newBlogPosted } from "../../lib/sendEmail.js";
import { JWTAuthMiddleware } from "../../lib/auth/token.js";
import { adminOnlyMiddleware } from "../../lib/auth/admin.js";

const blogsRouter = express.Router();

blogsRouter.post(
	"/",
	checkBlogMiddleware,
	checkVdalidationResult,
	JWTAuthMiddleware,
	adminOnlyMiddleware,
	async (req, res, next) => {
		console.log("REQUEST BODY: ", req.body);
		try {
			const newBlog = await new BlogModel(req.body);
			const savedBlog = await newBlog.save();

			const blogPostWithAuthor = await newBlog.populate("author");
			const { author } = blogPostWithAuthor;

			await newBlogPosted(author.email, author.name, req.body.title);

			res.send(savedBlog);
		} catch (error) {
			console.log(error);
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
			links: mongoQuery.links(`${process.env.API_URL}/blogPosts`, total),
			total,
			totalPages: Math.ceil(total / mongoQuery.options.limit),
			blog,
		});
	} catch (error) {
		next(error);
	}
});

blogsRouter.get("/:blogId", JWTAuthMiddleware, async (req, res, next) => {
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

blogsRouter.put("/:blogId", JWTAuthMiddleware, async (req, res, next) => {
	try {
		let targetBlogPost = await BlogModel.findById(req.params.blogId);
		await targetBlogPost.populate("author");
		console.log(targetBlogPost);
		if (targetBlogPost) {
			if (req.user.email === targetBlogPost.author.email) {
				await targetBlogPost.update(req.body);
				res.send(targetBlogPost);
			} else {
				next(createError(403, `You can only modify your own blogposts`));
			}
			// const updateBlog = await BlogModel.findByIdAndUpdate(
			// 	req.params.usserId,
			// 	req.body,
			// 	{ new: true }
			// );
		} else {
			next(createError(404, `Blog with id ${req.params.blogId} not found!`));
		}
	} catch (error) {
		console.log(error);
		next(error);
	}
});

blogsRouter.delete(
	"/:blogId",
	JWTAuthMiddleware,
	adminOnlyMiddleware,
	async (req, res, next) => {
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
	}
);

// ********************************************** BLOGS COMMENTS ************************************************************

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
		const commentsUpdate = await BlogModel.findById(req.params.blogId);

		if (commentsUpdate) {
			const commentsIndex = commentsUpdate.comments.findIndex(
				(comment) => comment._id.toString() === req.params.commentId
			);
			if (commentsIndex !== -1) {
				const oldObject = commentsUpdate.comments[commentsIndex].toObject();

				commentsUpdate.comments[commentsIndex] = { ...oldObject, ...req.body };

				await commentsUpdate.save();
				res.send(commentsUpdate);
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

blogsRouter.delete("/:blogId/comments/:commentId", async (req, res, next) => {
	try {
		const deleteComments = await BlogModel.findByIdAndUpdate(
			req.params.blogId,
			{ $pull: { comments: { _id: req.params.commentId } } },
			{ new: true }
		);
		if (deleteComments) {
			res.send(deleteComments);
		} else {
			next(createError(404, `Comment with id ${req.params.blogId} not found!`));
		}
	} catch (error) {
		next(error);
	}
});

// Blogs AVATAR POST

blogsRouter.post(
	"/:blogId/cover",
	cloudinaryUploader,
	async (req, res, next) => {
		try {
			console.log(req.file.path, "LOOK ME");
			const blogsAvatar = await BlogModel.findByIdAndUpdate(
				req.params.blogId,
				{
					cover: req.file.path,
				},
				{ new: true }
			);
			if (blogsAvatar) {
				res.send(blogsAvatar);
			} else {
				next(createError(404, `Blog with id ${req.params.blogId} not found!`));
			}
		} catch (error) {
			console.log(error);
			next(error);
		}
	}
);

export default blogsRouter;
