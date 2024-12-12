import { NextConfig } from "next";

const nextConfig: NextConfig = {
    async headers() {
        return [
            {
                // 適用するパスを指定（全てのパスに適用する場合は "*"）
                source: "/(.*)",
                headers: [
                    {
                        key: "Content-Security-Policy",
                        value: "default-src * data: blob: 'unsafe-inline' 'unsafe-eval';", // 全てのリソースを許可
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
