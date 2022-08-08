import { checkSchema, validationResult } from 'express-validator';
import createError from 'http-errors';

const schema = {
	category: {
		in: ['body'],
		isString: {
			errorMessage: 'Category validation failed!',
		},
	},
	title: {
		in: ['body'],
		isString: {
			errorMessage: 'Title validation failed!',
		},
	},
	cover: {
		in: ['body'],
		isString: {
			errorMessage: 'Cover validation failed!',
		},
	},
	readTime: {
		value: {
			in: ['body'],
			isNumber: {
				errorMessage: 'Value validation failed!',
			},
		},
		unit: {
			in: ['body'],
			isString: {
				errorMessage: 'Unit validation failed!',
			},
		},
	},
	content: {
		in: ['body'],
		isString: {
			errorMessage: 'Content validation failed!',
		},
	},
};

export const checkBlogMiddleware = checkSchema(schema);

export const checkVdalidationResult = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		next(
			createError(400, 'Validation problems in req.body', {
				errorsList: errors.array(),
			})
		);
	} else {
		next();
	}
};
