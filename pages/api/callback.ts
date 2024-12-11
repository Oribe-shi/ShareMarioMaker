// pages/api/callback.ts
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { code } = req.query; // Discordから返ってきた認証コード
    const clientId = process.env.DISCORD_CLIENT_ID;
    const clientSecret = process.env.DISCORD_CLIENT_SECRET;
    const redirectUri = process.env.DISCORD_REDIRECT_URI;

    if (!code) {
        return res.status(400).json({ error: "Code is missing" });
    }

    try {
        // Discord APIにPOSTリクエストを送信してアクセストークンを取得
        const tokenResponse = await fetch("https://discord.com/api/v10/oauth2/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                client_id: clientId || "",
                client_secret: clientSecret || "",
                grant_type: "authorization_code",
                code: code as string,
                redirect_uri: redirectUri || "",
            }),
        });

        const tokenData = await tokenResponse.json();

        if (tokenData.error) {
            return res.status(400).json({ error: tokenData.error });
        }

        const accessToken = tokenData.access_token;

        // Discord APIを使ってユーザー情報を取得
        const userResponse = await fetch("https://discord.com/api/v10/users/@me", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        const userData = await userResponse.json();

        if (!userResponse.ok) {
            throw new Error(`Failed to fetch user data: ${JSON.stringify(userData)}`);
        }

        // ユーザー情報（ユーザー名など）をトップページにクエリパラメータとして付けてリダイレクト
        const host = req.headers.host;
        const redirectUrl = `https://${host}/?username=${encodeURIComponent(userData.username)}`;

        res.redirect(302, redirectUrl); // ユーザー情報とともにトップページにリダイレクト
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
}
