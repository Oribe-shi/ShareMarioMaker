// callback.ts
import { NextApiRequest, NextApiResponse } from "next";
import { DiscordSDK } from "@discord/embedded-app-sdk";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const code = req.query.code as string;
    const client_id = process.env.DISCORD_CLIENT_ID;
    const client_secret = process.env.DISCORD_CLIENT_SECRET;
    const redirect_uri = process.env.DISCORD_REDIRECT_URI;

    if (!code) {
        res.status(400).json({ error: "Missing authorization code" });
        return;
    }

    try {
        if (!client_id) {
            throw new Error("Discord client ID is not configured");
        }

        const discordSdk = new DiscordSDK(client_id);

        // Discord API にコードを送信してアクセストークンを取得
        const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                client_id: client_id || "",
                client_secret: client_secret || "",
                grant_type: "authorization_code",
                code: code,
                redirect_uri: redirect_uri || "",
            }),
        });

        if (!tokenResponse.ok) {
            throw new Error("Failed to fetch access token");
        }

        const tokenData = await tokenResponse.json();
        const access_token = tokenData.access_token;

        // Discord SDKの認証処理
        const auth = await discordSdk.commands.authenticate({ access_token });

        if (!auth) {
            throw new Error("Failed to authenticate");
        }

        // 認証成功後にユーザー情報を取得
        const userData = await fetch("https://discord.com/api/v10/users/@me", {
            headers: {
                Authorization: `Bearer ${access_token}`,
                "Content-Type": "application/json",
            },
        });

        const userJson = await userData.json();

        // ユーザー情報をページに表示するためにクエリパラメータで渡す
        const redirectUrl = `https://${req.headers.host}?username=${encodeURIComponent(userJson.username)}`;
        res.redirect(302, redirectUrl);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
}
