"use server"; // サーバーサイド専用コードにする

import { NextResponse } from "next/server";
import { Client, GatewayIntentBits } from "discord.js";

// Discordボットのクライアントを作成
const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

async function getDiscordUsername() {
    // ボットが準備完了するまで待機
    if (!client.isReady()) {
        await client.login(process.env.DISCORD_BOT_TOKEN);
    }

    const user = await client.users.fetch(process.env.DISCORD_USER_ID!); // ユーザーIDを指定してユーザー情報を取得
    return user.username; // ユーザー名を返します
}

export async function GET() {
    try {
        const username = await getDiscordUsername();
        return NextResponse.json({ username });
    } catch (error) {
        console.error("Error fetching username:", error);
        return NextResponse.json({ error: "ユーザー名の取得に失敗しました" }, { status: 500 });
    }
}
