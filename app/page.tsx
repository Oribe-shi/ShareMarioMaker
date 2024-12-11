// app/page.tsx

import { useEffect, useState } from "react";

export default function Home() {
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const response = await fetch("/api/discordActivity");
                const data = await response.json();
                if (data.username) {
                    setUsername(data.username);
                }
            } catch (error) {
                console.error("Error fetching Discord username:", error);
            }
        };

        fetchUsername();
    }, []);

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <h1>{username ? `${username}さんがアクティビティを開始しました` : "アクティビティ情報を取得中..."}</h1>
            </main>
        </div>
    );
}
