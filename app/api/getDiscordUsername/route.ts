// app/api/getDiscordUsername/route.ts

import { NextResponse } from "next/server";

export async function GET() {
    try {
        // DiscordのBotトークンを使ってDiscord APIから情報を取得
        const res = await fetch("https://discord.com/api/v10/users/@me", {
            headers: {
                Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
            },
        });

        if (!res.ok) {
            throw new Error("Discord APIからユーザー情報を取得できませんでした");
        }

        const data = await res.json();
        return NextResponse.json({ username: data.username });
    } catch (error) {
        console.error("Error fetching Discord username:", error);
        return NextResponse.json({ error: "ユーザー名の取得に失敗しました" }, { status: 500 });
    }
}
