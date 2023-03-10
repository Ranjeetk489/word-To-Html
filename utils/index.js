import { google } from "googleapis";
const drive = google.drive("v3");
import "dotenv/config";

const oAuthClient = new google.auth.OAuth2(
	process.env.CLIENT_ID,
	process.env.CLIENT_SECRET,
	process.env.REDIRECT_URI,
);

const getGoogleConsentUrl = () => {
	const scopes = [
		"https://www.googleapis.com/auth/documents.readonly",
		"https://www.googleapis.com/auth/drive.readonly",
	];
	return oAuthClient.generateAuthUrl({
		access_type: "offline",
		scope: scopes,
	});
};

const getGoogleAccessToken = async (code) => {
	try {
		const { tokens } = await oAuthClient.getToken(code);
		return tokens.access_token;
	} catch (err) {
		console.log(err, "accesstoken");
	}
};

const getGoogleDocsInHtml = async (accessToken, documentId) => {
	const auth = new google.auth.OAuth2();
	auth.setCredentials({ access_token: accessToken });
	try {
		const res = await drive.files.export(
			{
				auth,
				fileId: documentId,
				mimeType: "text/html",
			},
			{ responseType: "stream" },
		);
		return res.data;
	} catch (err) {
		console.log(err, "getGoogleDocsInHtml");
	}
};

const convertBufferToBase64 = (stream) => {
	try {
		let documentBody = "";
		stream.on("data", (chunk) => {
			documentBody += chunk.toString();
		});
		stream.on("end", () => {
			console.log(documentBody);
		});
	} catch (err) {
		console.log(err, "convertBufferToBase64");
	}
};

export {
	getGoogleDocsInHtml,
	getGoogleConsentUrl,
	getGoogleAccessToken,
	convertBufferToBase64,
};
