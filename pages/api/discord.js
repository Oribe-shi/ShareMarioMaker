// pages/api/discord.js

import { Client } from "discord.js";

export default async function handler(req, res) {
    if (req.method === "GET") {
        const client = new Client();
        const { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET } = process.env;

        try {
            // Discord APIの認証を行い、現在のユーザー情報を取得
            await client.login(DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET);
            const activity = await client.fetchActivity(); // アクティビティ情報を取得

            const user = await client.users.fetch(activity.userId); // アクティビティ参加ユーザー情報を取得
            res.status(200).json({
                username: user.username,
                avatar: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to fetch Discord activity" });
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
}
