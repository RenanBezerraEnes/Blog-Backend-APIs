import { checkSchema, validationResult } from "express-validator";
import createError from "http-errors";

const schema = {
	name: {
		in: ["body"],
		isString: {
			errorMessage: "Name is missed, try again!",
		},
	},
	surname: {
		in: ["body"],
		isString: {
			errorMessage: "Surname is missed, try again!",
		},
	},
	email: {
		in: ["body"],
		isEmail: {
			errorMessage: "Email is miseed, try again!",
		},
	},
	dateOfBirth: {
		in: ["body"],
		isDate: {
			errorMessage: "Date is missed, try again",
		},
	},
	avatar: {
		in: ["body"],
		isString: {
			errorMessage: "Avatar is missed, try again",
		},
	},
};

export const checkAuthorMiddleware = checkSchema(schema);

export const checkVdalidationResult = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		next(
			createError(400, "Validation problems in req.body", {
				errorsList: errors.array(),
			})
		);
	} else {
		next();
	}
};
