import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const accessToken = process.env.DISCORD_ACCESS_TOKEN;

    // Discord APIからユーザー情報を取得
    const response = await fetch("https://discord.com/api/v10/users/@me", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        res.status(response.status).send("Failed to fetch user data");
        return;
    }

    const user = await response.json();
    const avatarUrl = user.avatar
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`
        : `https://cdn.discordapp.com/embed/avatars/${user.discriminator % 5}.png`;

    // 動的にHTMLを生成
    const html = `
        <!DOCTYPE html>
        <html lang="ja">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>ユーザー情報</title>
        </head>
        <body>
            <h1>ユーザー情報</h1>
            <p>ユーザー名: ${user.global_name || user.username}</p>
            <img src="${avatarUrl}" alt="User Avatar" style="border-radius: 50%; width: 128px; height: 128px;">
        </body>
        </html>
    `;

    res.setHeader("Content-Type", "text/html");
    res.status(200).send(html);
}
