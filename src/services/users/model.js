import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const usersScheme = new Schema(
	{
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		email: { type: String, required: true },
		dateOfBirth: { type: Date, required: true },
		password: { type: String, required: true },
	},
	{
		timestamps: true,
	}
);

// I am not using arrow function in this especific case
// because I need have access a "this" key word, it's not available in arrow functions

usersScheme.pre("save", async function (next) {
	const newUser = this;

	const plainPassword = newUser.password;

	if (newUser.isModified("password")) {
		const hash = await bcrypt.hash(plainPassword, 10);

		newUser.password = hash;
	}

	next();
});

// hide password or other fields

usersScheme.methods.toJSON = function () {
	const userDetails = this;
	const userObject = userDetails.toObject();

	delete userObject.password;
	delete userObject.__v;

	return userObject;
};

export default model("User", usersScheme);
