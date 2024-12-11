module.exports = {
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "Content-Security-Policy",
                        value: "connect-src 'self' https://1309879469544050759.discordsays.com https://discord.com/api/ https://canary.discord.com/api/ https://ptb.discord.com/api/;",
                    },
                ],
            },
        ];
    },
};
