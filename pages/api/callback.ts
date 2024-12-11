import { NextApiRequest, NextApiResponse } from "next";
import { DiscordSDK } from "@discord/embedded-app-sdk";

// DiscordのクライアントIDとシークレットを環境変数から取得
const clientId = process.env.DISCORD_CLIENT_ID;
const clientSecret = process.env.DISCORD_CLIENT_SECRET;

if (!clientId || !clientSecret) {
    throw new Error("Client ID or Client Secret is missing.");
}

// DiscordSDKのインスタンスを生成
const discordSdk = new DiscordSDK(clientId);

// 認証後にアクセストークンを取得し、ユーザー情報を返す
async function handleCallback(req: NextApiRequest, res: NextApiResponse) {
    const code = req.query.code as string;

    if (!code) {
        res.status(400).json({ error: "Missing authorization code." });
        return;
    }

    try {
        // Get access token using Discord OAuth API
        const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                client_id: clientId as string,
                client_secret: clientSecret as string,
                grant_type: "authorization_code",
                code: code,
                redirect_uri: process.env.DISCORD_REDIRECT_URI || "",
            }),
        });

        const { access_token } = await tokenResponse.json();
        const auth = await discordSdk.commands.authenticate({ access_token });

        res.status(200).json(auth.user);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
}

export default handleCallback;
