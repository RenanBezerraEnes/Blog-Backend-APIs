import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (recipientAddress) => {
	const msg = {
		to: recipientAddress,
		from: process.env.SENDER_EMAIL,
		subject: "Thanks for registering!",
		text: "this is a sample text",
		html: "<strong>Heey read me</strong>",
	};
	await sgMail.send(msg);
};

export const authorWelcome = async (recipientAddress, name) => {
	try {
		const msg = {
			to: recipientAddress,
			from: process.env.SENDER_EMAIL,
			subject: "Thanks for registering!",
			text: "this is a sample text",
			html: "<div></div>",
			templateId: "d-5cc0126f553343e1999f0b3d7dde72f8",
			dynamic_template_data: {
				author_name: name,
			},
		};
		await sgMail.send(msg);
	} catch (error) {
		console.log(error.response.body.errors);
	}
};

export const newBlogPosted = async (recipientAddress, name, title) => {
	try {
		const msg = {
			to: recipientAddress,
			from: process.env.SENDER_EMAIL,
			subject: "Thanks for registering!",
			text: "this is a sample text",
			html: "<div></div>",
			templateId: "d-5cc0126f553343e1999f0b3d7dde72f8",
			dynamic_template_data: {
				author_name: name,
				author_title: title,
			},
		};
		await sgMail.send(msg);
	} catch (error) {
		console.log(error.response.body.errors);
	}
};
