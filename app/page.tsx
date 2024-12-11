"use client"; // クライアントコンポーネントとしてマーク

import { useEffect, useState } from "react";

export default function Home() {
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        // Discordアクティビティ開始したユーザー名を取得するAPIを呼び出す
        async function fetchUsername() {
            const response = await fetch("/api/getDiscordUsername");
            if (response.ok) {
                const data = await response.json();
                setUsername(data.username);
            }
        }
        fetchUsername();
    }, []);

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                {username ? <h1>アクティビティを開始したユーザー: {username}</h1> : <h1>ユーザー名を取得中...</h1>}
            </main>
        </div>
    );
}
