// app/page.tsx
"use client";

// app/page.tsx

import { useEffect, useState } from "react";

export default function Home() {
    const [userInfo, setUserInfo] = useState<{ username: string; avatar: string } | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchUserInfo() {
            try {
                const response = await fetch("/api/discord");

                // レスポンスが正常でない場合、エラーを設定
                if (!response.ok) {
                    throw new Error("Failed to fetch user info");
                }

                const data = await response.json();
                if (data.username && data.avatar) {
                    setUserInfo(data);
                }
            } catch (error) {
                setError(error instanceof Error ? error.message : "An unknown error occurred");
            }
        }

        fetchUserInfo();
    }, []);

    return (
        <div>
            <h1>Discord Activity</h1>
            {error && <p>Error: {error}</p>}
            {userInfo ? (
                <div>
                    <p>Username: {userInfo.username}</p>
                    <img src={userInfo.avatar} alt="User Avatar" />
                </div>
            ) : (
                <p>Loading user info...</p>
            )}
        </div>
    );
}
