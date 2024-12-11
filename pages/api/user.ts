import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const accessToken = process.env.DISCORD_ACCESS_TOKEN; // アクセストークンを環境変数で管理

    const response = await fetch("/api/user"); // 修正: 正しいエンドポイントを指定

    if (!response.ok) {
        res.status(response.status).json({ error: "Failed to fetch user data" });
        return;
    }

    const user = await response.json();
    const avatarUrl = user.avatar
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`
        : `https://cdn.discordapp.com/embed/avatars/${user.discriminator % 5}.png`;

    res.status(200).json({
        username: user.global_name || user.username,
        avatarUrl,
    });
}
