// pages/api/discord.js

import { Client } from "discord.js";

export default async function handler(req, res) {
    if (req.method === "GET") {
        const { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET } = process.env;

        // Discord API認証情報
        const authURL = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&response_type=code&scope=activities.read`;

        try {
            // Discord APIから認証コードを取得
            const response = await fetch(authURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    client_id: DISCORD_CLIENT_ID,
                    client_secret: DISCORD_CLIENT_SECRET,
                    grant_type: "authorization_code",
                    code: req.query.code, // 認証コード
                    redirect_uri: "YOUR_REDIRECT_URI", // リダイレクトURI
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to authenticate with Discord API");
            }

            const data = await response.json();
            const accessToken = data.access_token;

            // アクセストークンを使ってユーザー情報を取得
            const userResponse = await fetch("https://discord.com/api/v10/users/@me", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const userData = await userResponse.json();

            res.status(200).json({
                username: userData.username,
                avatar: `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to fetch Discord activity or user info" });
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
}
