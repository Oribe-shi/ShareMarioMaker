import { NextApiRequest, NextApiResponse } from "next";
import { DiscordSDK } from "@discord/embedded-app-sdk";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const client_id = process.env.DISCORD_CLIENT_ID;

    if (!client_id) {
        return res.status(500).json({ error: "Missing Discord client ID" });
    }

    try {
        // DiscordSDKのインスタンスを生成
        const discordSdk = new DiscordSDK(client_id);

        // DiscordSDKの初期化
        await discordSdk.ready();

        // Discordの認証URLにリダイレクト
        await discordSdk.commands.authorize({
            client_id,
            response_type: "code",
            state: "",
            prompt: "none",
            scope: ["identify", "guilds"],
        });

        // 認証後、Discordからのリダイレクトを受け取る
        res.redirect(302, `https://share-mario-maker.vercel.app/api/callback`);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "Failed to start Discord login" });
        }
    }
}
