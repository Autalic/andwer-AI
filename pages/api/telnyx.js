import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const event = req.body?.data?.payload || {};
    const caller = event.from || "Unknown caller";
    const transcription = event.transcription || "No transcription provided.";

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: `New voicemail from ${caller}`,
      text: transcription,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("SMTP send failed:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
}
