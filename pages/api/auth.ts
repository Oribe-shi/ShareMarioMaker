import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const clientId = process.env.DISCORD_CLIENT_ID;
    const clientSecret = process.env.DISCORD_CLIENT_SECRET;
    const redirectUri = process.env.REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
        res.status(500).json({ error: "Missing environment variables" });
        return;
    }

    // OAuth2トークンを取得する例
    const response = await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            grant_type: "authorization_code",
            code: req.body.code, // フロントエンドから送信されたコード
        }),
    });

    if (!response.ok) {
        res.status(response.status).json({ error: "Failed to fetch token" });
        return;
    }

    const data = await response.json();
    res.status(200).json(data);
}
