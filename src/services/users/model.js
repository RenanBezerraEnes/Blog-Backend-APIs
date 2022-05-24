import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const usersScheme = new Schema(
	{
		name: { type: String, required: true },
		surname: { type: String, required: true },
		email: { type: String, required: true },
		birthday: { type: Date, required: false },
		password: { type: String, required: false },
		role: {
			type: String,
			required: true,
			default: "User",
			enum: ["User", "Admin"],
		},
		googleId: { type: String, required: false },
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

// To check the credencials, for example if this email and password is correct than, it's possible to login, otherwise 401 status
usersScheme.statics.checkCredencials = async function (email, plainPassword) {
	const user = await this.findOne({ email });

	if (user) {
		const isPasswordCorrect = await bcrypt.compare(
			plainPassword,
			user.password
		);
		if (isPasswordCorrect) {
			return user;
		} else {
			return null;
		}
	} else {
		return null;
	}
};

export default model("User", usersScheme);
