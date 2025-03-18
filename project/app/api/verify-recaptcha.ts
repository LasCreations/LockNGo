import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ success: false, message: "Method not allowed" });

  const { token } = req.body;
  if (!token) return res.status(400).json({ success: false, message: "No token provided" });

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY || "",
        response: token,
      }).toString(),
    });

    const { success } = await response.json();
    return res.status(success ? 200 : 400).json({ success });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
}


