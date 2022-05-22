import { checkSchema, validationResult } from "express-validator";
import createError from "http-errors";

const schema = {
	name: {
		in: ["body"],
		isString: {
			errorMessage: "firstName is missed, try again!",
		},
	},
	surname: {
		in: ["body"],
		isString: {
			errorMessage: "lastName is missed, try again!",
		},
	},
	email: {
		in: ["body"],
		isEmail: {
			errorMessage: "Email is miseed, try again!",
		},
	},
	birthday: {
		in: ["body"],
		isDate: {
			errorMessage: "Date is missed, try again",
		},
	},
};

export const checkUserMiddleware = checkSchema(schema);

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
