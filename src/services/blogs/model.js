import mongoose from "mongoose";

const { Schema, model } = mongoose;

const blogSchema = new Schema(
	{
		category: { type: String, required: true },
		title: { type: String, required: true },
		cover: { type: String, required: true },
		readTime: {
			type: Object,
			value: { type: Number, required: true },
			unit: { type: String, required: true },
		},
		author: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "authors",
		},
		content: { type: String, required: true },
		comments: [{ comment: String, commentDate: Date }],
	},
	{
		timestamps: true,
	}
);

export default model("blogs", blogSchema);
