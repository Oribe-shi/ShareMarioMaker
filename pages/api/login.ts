// /pages/api/login.ts
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const redirectUri = process.env.DISCORD_REDIRECT_URI;
    const clientId = process.env.DISCORD_CLIENT_ID;

    if (!redirectUri || !clientId) {
        return res.status(500).json({ error: "Missing environment variables" });
    }

    const scope = "identify";
    const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
    )}&response_type=code&scope=${scope}`;
    res.redirect(discordAuthUrl);
}
