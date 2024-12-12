import { NextConfig } from "next";

const nextConfig: NextConfig = {
    async headers() {
        const discordClientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;

        if (!discordClientId) {
            throw new Error("NEXT_PUBLIC_DISCORD_CLIENT_ID is not defined in environment variables.");
        }

        const discordBaseUrl = `https://${discordClientId}.discordsays.com/api/token`;

        return [
            {
                source: "/(.*)", // 全てのパスに適用
                headers: [
                    {
                        key: "Content-Security-Policy",
                        value: `default-src 'self'; connect-src 'self' https://share-mario-maker.vercel.app ${discordBaseUrl};`, // 環境変数を使用
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
