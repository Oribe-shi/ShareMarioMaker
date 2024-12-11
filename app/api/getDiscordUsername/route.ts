import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
        console.error("ユーザーIDが提供されていません");
        return NextResponse.json({ error: "ユーザーIDが提供されていません" }, { status: 400 });
    }

    try {
        const res = await fetch(`https://discord.com/api/v10/users/${userId}/activities`, {
            headers: {
                Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
            },
        });

        if (!res.ok) {
            console.error("Discord APIからアクティビティ情報を取得できませんでした");
            throw new Error("Discord APIからアクティビティ情報を取得できませんでした");
        }

        const data = await res.json();
        if (data.length === 0) {
            console.error("アクティビティに参加しているユーザーがいません");
            return NextResponse.json({ error: "アクティビティに参加しているユーザーがいません" }, { status: 404 });
        }

        const username = data[0]?.name || "不明なユーザー";
        return NextResponse.json({ username });
    } catch (error) {
        console.error("Error fetching Discord username:", error);
        return NextResponse.json({ error: "ユーザー名の取得に失敗しました" }, { status: 500 });
    }
}
