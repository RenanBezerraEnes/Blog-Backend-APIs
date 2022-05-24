import GoogleStrategy from "passport-google-oauth20";
import UsersModel from "../../services/users/model.js";
import passport from "passport";
import { generateJWTToken } from "./tools.js";

const googleStrategy = new GoogleStrategy(
	{
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackURL: `${process.env.API_URL}/users/googleRedirect`,
	},
	async (accessToken, refreshToken, profile, passportNext) => {
		try {
			const user = await UsersModel.findOne({ email: profile.emails[0].value });
			console.log("GOOGLE PROFILE", profile);
			if (user) {
				const accessToken = await generateJWTToken({
					_id: user._id,
					role: user.role,
				});

				passportNext(null, { token: accessToken });
			} else {
				const newUser = new UsersModel({
					name: profile.name.givenName,
					surname: profile.name.familyName,
					email: profile.emails[0].value,
					googleId: profile.id,
				});
				const savedUser = await newUser.save();

				const accessToken = await generateJWTToken({
					_id: savedUser._id,
					role: savedUser.role,
				});

				console.log("ACCESS TOKEN: ", accessToken);
				passportNext(null, { token: accessToken });
			}
		} catch (error) {
			passportNext(error);
		}
	}
);

passport.serializeUser((data, passportNext) => {
	passportNext(null, data);
});

export default googleStrategy;
