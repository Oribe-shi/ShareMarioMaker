import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // 環境変数からアクセストークンを取得
    const accessToken = process.env.DISCORD_ACCESS_TOKEN;

    // Discord APIにリクエストを送信
    const response = await fetch("https://discord.com/api/v10/users/@me", {
        headers: {
            Authorization: `Bearer ${accessToken}`, // 必須ヘッダー
        },
    });

    if (!response.ok) {
        // エラーが発生した場合の処理
        res.status(response.status).json({ error: "Failed to fetch user data" });
        return;
    }

    const user = await response.json();
    const avatarUrl = user.avatar
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`
        : `https://cdn.discordapp.com/embed/avatars/${user.discriminator % 5}.png`;

    // ユーザー情報をJSON形式で返却
    res.status(200).json({
        username: user.global_name || user.username,
        avatarUrl,
    });
}
