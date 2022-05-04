import express from "express";

const authorsRouter = express.Router();

authorsRouter.post("/", (req, res) => {
	res.send({ message: `HELLO I AM ${req.method}` });
});

authorsRouter.get("/", (req, res) => {
	res.send({ message: `HELLO I AM ${req.method}` });
});

authorsRouter.get("/:id", (req, res) => {
	res.send({ message: `HELLO I AM ${req.method}` });
});

authorsRouter.put("/:id", (req, res) => {
	res.send({ message: `HELLO I AM ${req.method}` });
});

authorsRouter.delete("/:id", (req, res) => {
	res.send({ message: `HELLO I AM ${req.method}` });
});

export default authorsRouter;
