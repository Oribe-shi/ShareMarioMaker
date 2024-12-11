import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const code = req.query.code as string; // Discordから返ってきたコード
    const redirectUri = process.env.DISCORD_REDIRECT_URI;

    if (!code) {
        res.status(400).json({ error: "Missing authorization code" });
        return;
    }

    try {
        // Discord API に POST リクエストを送信してアクセストークンを取得
        const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                client_id: process.env.DISCORD_CLIENT_ID || "",
                client_secret: process.env.DISCORD_CLIENT_SECRET || "",
                grant_type: "authorization_code",
                code: code,
                redirect_uri: redirectUri || "",
            }),
        });

        if (!tokenResponse.ok) {
            const error = await tokenResponse.json();
            throw new Error(`Failed to fetch access token: ${JSON.stringify(error)}`);
        }

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        // アクセストークンを使用してユーザー情報を取得
        const userResponse = await fetch("https://discord.com/api/users/@me", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!userResponse.ok) {
            const error = await userResponse.json();
            throw new Error(`Failed to fetch user data: ${JSON.stringify(error)}`);
        }

        const userData = await userResponse.json();

        // フロントエンド用のデータとしてユーザー名を返す
        res.status(200).json({ user: { username: userData.username } });
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
}
