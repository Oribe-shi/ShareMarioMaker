import { NextApiRequest, NextApiResponse } from "next";
import { DiscordSDK } from "@discord/embedded-app-sdk";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const code = req.query.code as string; // Discordから返ってきた認証コード
    const client_id = process.env.DISCORD_CLIENT_ID;
    const client_secret = process.env.DISCORD_CLIENT_SECRET;
    const redirectUri = process.env.DISCORD_REDIRECT_URI;

    if (!code || !client_id || !client_secret || !redirectUri) {
        return res.status(400).json({ error: "Missing required parameters" });
    }

    try {
        // Discordのトークンを取得
        const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                client_id: client_id,
                client_secret: client_secret,
                grant_type: "authorization_code",
                code: code,
                redirect_uri: redirectUri,
            }),
        });

        if (!tokenResponse.ok) {
            throw new Error("Failed to fetch access token");
        }

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        // DiscordSDKのインスタンスを生成
        const discordSdk = new DiscordSDK(client_id);
        await discordSdk.ready();

        // トークンを使って認証
        const auth = await discordSdk.commands.authenticate({
            access_token: accessToken,
        });

        if (!auth) {
            throw new Error("Authentication failed");
        }

        // ユーザー情報を取得
        const userResponse = await fetch("https://discord.com/api/v10/users/@me", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!userResponse.ok) {
            throw new Error("Failed to fetch user data");
        }

        const userData = await userResponse.json();

        // ユーザー名を取得してトップページにリダイレクト
        const redirectUrl = `https://share-mario-maker.vercel.app/?username=${encodeURIComponent(userData.username)}`;
        res.redirect(302, redirectUrl);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
}
