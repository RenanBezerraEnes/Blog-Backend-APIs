import express from "express";
import AuthorsModel from "./model.js";
import BlogModel from "./model.js";
import createError from "http-errors";
import { checkAuthorMiddleware, checkVdalidationResult } from "./validation.js";
import query2Mongo from "query-to-mongo";
import { cloudinaryUploader } from "../../lib/cloudiary.js";
import { authorWelcome } from "../../lib/sendEmail.js";
import { JWTAuthMiddleware } from "../../lib/auth/token.js";
import { adminOnlyMiddleware } from "../../lib/auth/admin.js";

const authorsRouter = express.Router();

authorsRouter.post(
	"/",
	checkAuthorMiddleware,
	checkVdalidationResult,
	JWTAuthMiddleware,
	adminOnlyMiddleware,
	async (req, res, next) => {
		try {
			const newAuthor = new AuthorsModel(req.body);
			const savedAuthor = await newAuthor.save();
			const { email, name } = req.body;

			await authorWelcome(email, name);
			res.send(savedAuthor);
		} catch (error) {
			console.log(error);
			//next(error);
		}
	}
);

authorsRouter.get(
	"/",
	JWTAuthMiddleware,
	adminOnlyMiddleware,
	async (req, res, next) => {
		try {
			const mongoQuery = query2Mongo(req.query);

			const total = await AuthorsModel.countDocuments(mongoQuery.criteria);

			if (!mongoQuery.options.skip) mongoQuery.options.skip = 0;

			if (!mongoQuery.options.limit || mongoQuery.options.limit > 10)
				mongoQuery.options.limit = 20;

			const authors = await AuthorsModel.find(
				mongoQuery.criteria,
				mongoQuery.options.fields
			)
				.skip(mongoQuery.options.skip)
				.limit(mongoQuery.options.limit)
				.sort(mongoQuery.options.sort);

			res.send({
				links: mongoQuery.links(`${process.env.API_URL}/blogPosts`, total),
				total,
				totalPages: Math.ceil(total / mongoQuery.options.limit),
				authors,
			});
		} catch (error) {
			next(error);
		}
	}
);

authorsRouter.get(
	"/:authorId/blogPosts",
	JWTAuthMiddleware,
	adminOnlyMiddleware,
	async (req, res) => {
		try {
			const blog = await BlogModel.find({ author: req.params.authorId });
			if (blog) {
				res.send(blog);
			} else {
				next(createError(404`User with id ${req.params.userId} not found`));
			}
		} catch (error) {
			next(error);
		}
	}
);

authorsRouter.get(
	"/:authorId",
	JWTAuthMiddleware,
	adminOnlyMiddleware,
	async (req, res) => {
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
	}
);

authorsRouter.put(
	"/:authorId",
	JWTAuthMiddleware,
	adminOnlyMiddleware,
	async (req, res) => {
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
	}
);

authorsRouter.delete(
	"/:authorId",
	JWTAuthMiddleware,
	adminOnlyMiddleware,
	async (req, res) => {
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
	}
);

// AUTHORS AVATAR POST

authorsRouter.post(
	"/:authorId/avatar",
	cloudinaryUploader,
	JWTAuthMiddleware,
	adminOnlyMiddleware,
	async (req, res, next) => {
		try {
			console.log(req.file.path, "LOOK ME");
			const avatarUpdate = await AuthorsModel.findByIdAndUpdate(
				req.params.authorId,
				{
					avatar: req.file.path,
				},
				{ new: true }
			);
			if (avatarUpdate) {
				res.send(avatarUpdate);
			} else {
				next(createError(404, `Blog with id ${req.params.blogId} not found!`));
			}
		} catch (error) {
			console.log(error);
			next(error);
		}
	}
);

export default authorsRouter;
