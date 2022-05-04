import express from "express";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
import usersRouter from "./services/users/index.js";
import authorsRouter from "./services/authors/index.js";

const server = express();

const port = 3001;

server.use(express.json());

server.use("/users", usersRouter);
server.use("/authors", authorsRouter);

// DATABASE CONNECTION

mongoose.connect(process.env.MONGO_CONNECTION_URL);

mongoose.connection.on("connected", () => {
	server.listen(port, () => {
		console.table(listEndpoints(server));
		console.log(`Server is running on port ${port}`);
	});
});
