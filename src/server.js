import express from "express";

const server = express();

const port = 3001;

server.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
