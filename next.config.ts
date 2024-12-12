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
                        value: "default-src 'none';", // すべてのリソースのロードを禁止
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
