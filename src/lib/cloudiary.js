import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import createError from "http-errors";

export const cloudinaryUploader = multer({
	storage: new CloudinaryStorage({
		cloudinary,
		params: {
			folder: "Blog Application/Avatars",
		},
	}),
	limits: { fileSize: 1 * 1024 * 1024 },
	fileFilter: (req, file, multerNext) => {
		if (file.mimetype !== "image/jpeg") {
			return multerNext(createError(400, "Only images and Gifs are allowed"));
		} else {
			multerNext(null, true);
		}
	},
}).single("avatar");
