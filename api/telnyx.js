export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { data } = req.body;
    const from = data?.payload?.from || "Unknown number";
    const transcription = data?.payload?.transcription || "No transcription";

    const accessToken = await getAccessToken();

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject: `New Voicemail from ${from}`,
      text: transcription,
    };

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.GMAIL_USER,
clientId: process.env.GMAIL_CLIENT_ID,
clientSecret: process.env.GMAIL_CLIENT_SECRET,
refreshToken: process.env.GMAIL_REFRESH_TOKEN,

        accessToken,
      },
    });

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Email send error:", error);  // <-- log full error
    return res.status(500).json({
      error: "Failed to send email",
      details: error.message,                   // <-- return error message too
    });
  }
}
