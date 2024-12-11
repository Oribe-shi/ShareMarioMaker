module.exports = {
    async headers() {
        return [
            {
                source: "/(.*)", // 全てのページに適用
                headers: [
                    {
                        key: "Content-Security-Policy",
                        value: "connect-src 'self' https://discord.com/api/ https://canary.discord.com/api/ https://ptb.discord.com/api/ https://cdn.discordapp.com/ https://discordsays.com/ https://1309879469544050759.discordsays.com/;",
                    },
                ],
            },
        ];
    },
};
