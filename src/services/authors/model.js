import mongoose from "mongoose";

const { Schema, model } = mongoose;

const authorsScheme = new Schema(
	{
		name: { type: String, required: true },
		surname: { type: String, required: true },
		email: { type: String, required: true },
		dateOfBirth: { type: Date, required: false },
		avatar: { type: String, required: true },
	},
	{
		timestamps: true,
	}
);

export default model("authors", authorsScheme);
