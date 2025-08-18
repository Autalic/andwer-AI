import nodemailer from "nodemailer";
import { google } from "googleapis";

const {
  GMAIL_USER,
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET,
  GMAIL_REFRESH_TOKEN
} = process.env;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { from, transcription } = req.body?.data?.payload || {};

    if (!from || !transcription) {
      return res.status(400).json({ error: "Missing from or transcription" });
    }

    // Google OAuth2 setup
    const oAuth2Client = new google.auth.OAuth2(
      GMAIL_CLIENT_ID,
      GMAIL_CLIENT_SECRET
    );
    oAuth2Client.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN });

    const accessToken = await oAuth2Client.getAccessToken();

    // Nodemailer transport with Gmail OAuth2
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: GMAIL_USER,
        clientId: GMAIL_CLIENT_ID,
        clientSecret: GMAIL_CLIENT_SECRET,
        refreshToken: GMAIL_REFRESH_TOKEN,
        accessToken: accessToken.token
      }
    });

    await transport.sendMail({
      from: `"Voicemail Bot" <${GMAIL_USER}>`,
      to: GMAIL_USER, // send back to yourself
      subject: `New Voicemail from ${from}`,
      text: transcription
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Email send failed:", err);
    return res.status(500).json({ error: "Failed to send email" });
  }
}
