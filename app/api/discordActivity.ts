// pages/api/discordActivity.ts
import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "discord.js";

const client = new Client({
    intents: ["Guilds", "GuildPresences"],
});

client.login(process.env.DISCORD_CLIENT_SECRET);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const guild = await client.guilds.fetch("サーバーID");
            const members = await guild.members.fetch();
            const onlineMembers = members.filter((member) => member.presence?.status === "online");

            const userNames = onlineMembers.map((member) => member.user.username);
            const userIcons = onlineMembers.map((member) => member.user.displayAvatarURL());

            res.status(200).json({ userNames, userIcons });
        } catch (error) {
            res.status(500).json({ error: "Discord API error" });
        }
    } else {
        res.status(405).json({ error: "Method Not Allowed" });
    }
}
