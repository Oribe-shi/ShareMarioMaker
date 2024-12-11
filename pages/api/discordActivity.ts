// discordActivity.ts
import { Client, GatewayIntentBits } from "discord.js";

export async function getUserInfo() {
    const client = new Client({
        intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
    });

    // Botのトークン
    const accessToken = process.env.DISCORD_BOT_TOKEN;

    // クライアントがログインした後に情報を取得
    await client.login(accessToken);

    // Botがログインした後にユーザー情報を取得
    const user = client.user;
    if (!user) {
        throw new Error("User not found");
    }

    return {
        username: user.username,
        discriminator: user.discriminator, // ユーザー名のタグ
        id: user.id,
    };
}
