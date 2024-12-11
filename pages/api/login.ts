import { DiscordSDK } from "@discord/embedded-app-sdk";
import { NextApiRequest, NextApiResponse } from "next";

// DiscordのクライアントIDを環境変数から取得
const clientId = process.env.DISCORD_CLIENT_ID;
if (!clientId) {
    throw new Error("Client ID is missing in the environment variables.");
}

// DiscordSDKのインスタンスを生成
const discordSdk = new DiscordSDK(clientId);

// 認証処理を行う関数
async function handleLogin(req: NextApiRequest, res: NextApiResponse) {
    try {
        // DiscordSDKの初期化
        await discordSdk.ready();

        // Discordの認証URLを生成
        const redirectUri = process.env.DISCORD_REDIRECT_URI;
        const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
            redirectUri || ""
        )}&response_type=code&scope=identify`;

        // リダイレクト用のURLを返す
        res.redirect(discordAuthUrl);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        } else {
            console.error("An unknown error occurred");
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
}

export default handleLogin;
