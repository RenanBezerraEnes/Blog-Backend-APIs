import express from "express";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
import usersRouter from "./services/users/index.js";
import authorsRouter from "./services/authors/index.js";
import blogsRouter from "./services/blogs/index.js";

const server = express();

const port = 3001;

// Just a console.log()
const loggerMiddleware = (req, res, next) => {
	console.log(`Incoming request --> ${req.method} -- ${new Date()}`);
	req.name = "Renan";
	next();
};
// Fake authentication
const fakeAuthenticationMiddleware = (req, res, next) => {
	if (req.name === "Renan") {
		next();
	} else {
		res.status(401).send("Only Renan's allowed");
	}
};
// ** GLOBAL LEVEL MIDDLEWARES **
server.use(loggerMiddleware);
server.use(fakeAuthenticationMiddleware);

server.use(express.json());

// ** HERE I HAVE A ROUTER LEVEL MIDDLEWARE ->
server.use("/users", loggerMiddleware, usersRouter);
// **

server.use("/authors", authorsRouter);
server.use("/blogPosts", blogsRouter);

// DATABASE CONNECTION

mongoose.connect(process.env.MONGO_CONNECTION_URL);

mongoose.connection.on("connected", () => {
	server.listen(port, () => {
		console.table(listEndpoints(server));
		console.log(`Server is running on port ${port}`);
	});
});
