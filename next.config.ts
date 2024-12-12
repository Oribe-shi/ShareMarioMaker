import { NextConfig } from "next";

const nextConfig: NextConfig = {
    async headers() {
        const discordClientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;

        if (!discordClientId) {
            throw new Error("NEXT_PUBLIC_DISCORD_CLIENT_ID is not defined in environment variables.");
        }

        const discordApiUrl = `https://${discordClientId}.discordsays.com/api/token`;
        const discordProxyUrl = `https://${discordClientId}.discordsays.com/.proxy/`;

        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "Content-Security-Policy",
                        value: `
                            default-src 'self'; 
                            connect-src 
                                'self' 
                                https://share-mario-maker.vercel.app 
                                https://discord.com/api/ 
                                https://1309879469544050759.discordsays.com
                                https://discord.com/api/ https://canary.discord.com/api/
                                https://ptb.discord.com/api/
                                ${discordApiUrl} 
                                ${discordProxyUrl} 
                                wss://${discordClientId}.discordsays.com/.proxy/ 
                                data: blob:;
                        `
                            .replace(/\s+/g, " ")
                            .trim(),
                    },
                ],
            },
        ];
    },
};
