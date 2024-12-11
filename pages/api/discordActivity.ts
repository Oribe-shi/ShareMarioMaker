import { Client, GatewayIntentBits } from "discord.js";
import type { NextApiRequest, NextApiResponse } from "next";

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent],
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // ボットがログインしていない場合はログインさせる
    if (!client.isReady()) {
        await client.login(process.env.DISCORD_BOT_TOKEN);
    }

    client.on("presenceUpdate", (oldPresence, newPresence) => {
        if (newPresence.activities.some((activity) => activity.name === "ShareMarioMaker")) {
            const user = newPresence.user;
            // ユーザーがnullでない場合にのみレスポンスを返す
            if (user) {
                res.status(200).json({
                    username: user.username,
                    id: user.id,
                });
            } else {
                res.status(404).json({ error: "User not found" });
            }
        }
    });

    // イベントリスナーが発火しなかった場合の処理
    res.status(404).send("No activity found");
}
