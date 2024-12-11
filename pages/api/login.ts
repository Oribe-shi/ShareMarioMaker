import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const redirectUri = process.env.DISCORD_REDIRECT_URI; // 環境変数から取得
    const clientId = process.env.DISCORD_CLIENT_ID;

    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri || ""
    )}&response_type=code&scope=identify`;

    res.redirect(discordAuthUrl);
}
