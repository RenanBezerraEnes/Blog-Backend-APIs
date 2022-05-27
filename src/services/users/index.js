import express from "express";
import UsersModel from "./model.js";
import createError from "http-errors";
import passport from "passport";
import { checkUserMiddleware, checkVdalidationResult } from "./validation.js";
import { sendEmail } from "../../lib/sendEmail.js";
import { generateJWTToken } from "../../lib/auth/tools.js";
import { JWTAuthMiddleware } from "../../lib/auth/token.js";
import { adminOnlyMiddleware } from "../../lib/auth/admin.js";

const usersRouter = express.Router();

usersRouter.post(
	"/register",
	checkUserMiddleware,
	checkVdalidationResult,
	async (req, res, next) => {
		try {
			const newUser = new UsersModel(req.body);
			const savedUser = await newUser.save();

			res.send(savedUser);
		} catch (error) {
			next(error);
		}
	}
);

usersRouter.post("/login", async (req, res, next) => {
	try {
		const { email, password } = req.body;

		const user = await UsersModel.checkCredencials(email, password);
		if (user) {
			const token = await generateJWTToken({
				_id: user._id,
				role: user.role,
				email: user.email,
			});
			res.send({ accessToken: token });
		} else {
			next(createError(401, "Credentials are not valid!"));
		}
	} catch (error) {
		next(error);
	}
});

usersRouter.get(
	"/",
	JWTAuthMiddleware,
	adminOnlyMiddleware,
	async (req, res, next) => {
		try {
			const users = await UsersModel.find();
			res.send(users);
		} catch (error) {
			next(error);
		}
	}
);

usersRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
	try {
		const currentLoggedInUser = await UsersModel.findById(req.user._id);
		res.send({ user: currentLoggedInUser });
	} catch (error) {
		next(error);
	}
});

usersRouter.put("/me", JWTAuthMiddleware, async (req, res, next) => {
	try {
		const modifieCurrentLoggedUser = await UsersModel.findByIdAndUpdate(
			req.user._id,
			req.body,
			{ new: true }
		);
		if (modifieCurrentLoggedUser) {
			res.send({ user: modifieCurrentLoggedUser });
		} else {
			next(createError(404, `User with id ${req.user._id} not found`));
		}
	} catch (error) {
		next(error);
	}
});

usersRouter.delete("/me", JWTAuthMiddleware, async (req, res, next) => {
	try {
		const deleteCurrentUser = await UsersModel.findByIdAndDelete(req.user._id);
		if (deleteCurrentUser) {
			res.status(204).send();
		} else {
			next(createError(404, `User with id ${req.user._id} not found`));
		}
	} catch (error) {
		next(error);
	}
});

// GOOGLE
usersRouter.get(
	"/googleLogin",
	passport.authenticate("google", { scope: ["profile", "email"] })
);

usersRouter.get(
	"/googleRedirect",
	passport.authenticate("google"),
	async (req, res, next) => {
		try {
			res.redirect(`${process.env.FE_URL}?accessToken=${req.user.token}`);
		} catch (error) {
			next(error);
		}
	}
);

usersRouter.get(
	"/:userId",
	JWTAuthMiddleware,
	adminOnlyMiddleware,
	async (req, res, next) => {
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
	}
);

usersRouter.put(
	"/:userId",
	JWTAuthMiddleware,
	adminOnlyMiddleware,
	async (req, res, next) => {
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
	}
);

usersRouter.delete(
	"/:userId",
	JWTAuthMiddleware,
	adminOnlyMiddleware,
	async (req, res, next) => {
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
	}
);

// SEND EMAIL

usersRouter.post("/email", async (req, res, next) => {
	try {
		const { email } = req.body;

		await sendEmail(email);
		res.send({ message: "Email sent sucessfully, check your box!" });
	} catch (error) {
		next(error);
	}
});

export default usersRouter;
