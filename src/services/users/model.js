import mongoose from "mongoose";

const { Schema, model } = mongoose;

const usersScheme = new Schema(
	{
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		email: { type: String, required: true },
		dateOfBirth: { type: Date, required: true },
	},
	{
		timestamps: true,
	}
);

export default model("User", usersScheme);
