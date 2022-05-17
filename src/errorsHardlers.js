import multer from "multer";

export const badRequestHandler = (err, req, res, next) => {
	if (err.status === 400 || err instanceof multer.MulterError) {
		res.status(400).send({ message: err.message, errorsList: err.errorsList });
	} else {
		next(err);
	}
}; //400

export const unauthorizedHandler = (err, req, res, next) => {
	if (err.status === 401) {
		res.status(401).send({ message: err.message });
	} else {
		next(err);
	}
}; //401

export const forbiddenHandler = (err, req, res, next) => {
	if (err.status === 403) {
		res.status(403).send({ message: err.message });
	} else {
		next(err);
	}
}; //403

export const notFoundHandler = (err, req, res, next) => {
	if (err.status === 404) {
		res.status(404).send({ message: err.message });
	} else {
		next(err);
	}
}; //404

export const genericErrors = (err, req, res, next) => {
	res.status(500).send({
		error:
			"Sorry we have a error on the server, try again or contact us please!",
	});
};
