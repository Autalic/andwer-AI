export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const event = req.body?.data?.payload || {};
    const caller = event.from || "Unknown caller";
    const transcription = event.transcription || "No transcription provided.";

    // Send email via Resend API
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "voicemail@rauch.nz",   // must be verified in Resend
        to: "info@rauch.nz",          // or your personal email
        subject: `New voicemail from ${caller}`,
        text: transcription,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Resend API error:", errText);
      throw new Error(errText);
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
}
