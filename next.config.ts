module.exports = {
    async headers() {
        return [
            {
                source: "/(.*)", // すべてのリクエストに適用
                headers: [
                    {
                        key: "Content-Security-Policy",
                        value: `
                            connect-src 'self' https://discord.com/api/ https://1309879469544050759.discordsays.com;
                            default-src 'self';
                            img-src 'self' data: blob:;
                            script-src 'self';
                            style-src 'self' 'unsafe-inline';
                            frame-src 'self';
                        `
                            .replace(/\s{2,}/g, " ")
                            .trim(), // 空白の整形
                    },
                ],
            },
        ];
    },
};
