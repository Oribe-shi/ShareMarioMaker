"use client"; // クライアントコンポーネントを明示的に指定

import { useEffect, useState } from "react";
import { getUserInfo } from "../pages/api/discordActivity"; // discordActivity.ts からインポート

export default function Home() {
    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const user = await getUserInfo(); // ユーザー情報を取得
                setUserName(user.username); // ユーザー名をstateに設定
            } catch (error) {
                console.error("Failed to fetch user info", error);
            }
        };

        fetchUserName();
    }, []); // ページが最初に読み込まれたときだけ実行

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <div id="app">
                    {userName ? (
                        <h1>Welcome, {userName}!</h1> // ユーザー名を表示
                    ) : (
                        <h1>Loading user info...</h1>
                    )}
                </div>
            </main>
        </div>
    );
}
