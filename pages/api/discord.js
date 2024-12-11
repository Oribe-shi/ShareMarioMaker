// pages/api/discord.js
import fetch from "node-fetch";

export default async function handler(req, res) {
    const token = process.env.DISCORD_BOT_TOKEN;

    if (!token) {
        res.status(500).json({ error: "Missing Discord API token" });
        return;
    }

    try {
        const response = await fetch("https://discord.com/api/users/@me", {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            res.status(response.status).json({ error: "Failed to fetch Discord user info" });
            return;
        }

        const userInfo = await response.json();
        res.status(200).json(userInfo);
    } catch (error) {
        res.status(500).json({ error: "Error fetching data from Discord API" });
    }
}
