import express from "express";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
import cors from "cors";
import usersRouter from "./services/users/index.js";
import authorsRouter from "./services/authors/index.js";
import blogsRouter from "./services/blogs/index.js";
import {
	badRequestHandler,
	unauthorizedHandler,
	forbiddenHandler,
	notFoundHandler,
	genericErrors,
} from "./errorsHardlers.js";

const server = express();

const port = 3001;

const loggerMiddleware = (req, res, next) => {
	console.log(`Incoming request --> ${req.method} -- ${new Date()}`);
	next();
};

// *************** GLOBAL LEVEL MIDDLEWARES ************

server.use(cors());
server.use(loggerMiddleware);
server.use(express.json());

// HERE I HAVE A ROUTER LEVEL MIDDLEWARE --->

server.use("/users", loggerMiddleware, usersRouter);
server.use("/authors", authorsRouter);
server.use("/blogPosts", blogsRouter);

// HERE I CAN USE THE ERROR MIDDLEWARE(AFTER ENDPOINTS)
server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(forbiddenHandler);
server.use(notFoundHandler);
server.use(genericErrors);

// DATABASE CONNECTION

mongoose.connect(process.env.MONGO_CONNECTION_URL);

mongoose.connection.on("connected", () => {
	server.listen(port, () => {
		console.table(listEndpoints(server));
		console.log(`Server is running on port ${port}`);
	});
});
