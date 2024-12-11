import { NextApiRequest, NextApiResponse } from "next";
import { Client } from "discord.js";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const client = new Client({ intents: ["Guilds", "GuildMembers", "GuildPresences"] });

    try {
        await client.login(process.env.DISCORD_BOT_TOKEN);

        const guild = await client.guilds.fetch(process.env.DISCORD_GUILD_ID!);
        const members = await guild.members.fetch();

        const participants = members.map((member) => ({
            username: member.user.username,
            avatarURL: member.user.avatarURL(),
            activity: member.presence?.activities[0]?.name || null,
        }));

        res.status(200).json({ participants });
    } catch {
        res.status(500).json({ error: "エラーが発生しました" });
    } finally {
        client.destroy();
    }
}
