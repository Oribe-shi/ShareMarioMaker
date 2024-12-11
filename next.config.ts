import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true, // React の厳密モードを有効にしてパフォーマンスやバグの検出を促進
    typescript: {
        ignoreBuildErrors: false, // 本番環境では TypeScript のエラーを無視しない
    },
    eslint: {
        ignoreDuringBuilds: false, // 本番環境で ESLint エラーを無視しない
    },
    env: {
        // .env.local に設定した環境変数を本番環境でも使用するための設定
        NEXT_PUBLIC_API_TOKEN: process.env.NEXT_PUBLIC_API_TOKEN,
        DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
        DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    },
};

export default nextConfig;
