// next.config.ts

import { NextConfig } from "next";

const nextConfig: NextConfig = {
    async headers() {
        return [
            {
                source: "/(.*)", // 全てのリクエストに対して
                headers: [
                    {
                        key: "Content-Security-Policy",
                        value: "", // 空のCSPヘッダーで無効化
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
