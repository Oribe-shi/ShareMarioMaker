"use client";

import React, { useState, useEffect } from "react";

export default function Home() {
    const [userName, setUserName] = useState<string | null>(null);

    // 認証済みのユーザー情報を取得する関数
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch("/api/callback"); // サーバーのエンドポイントを呼び出す
                if (response.ok) {
                    const data = await response.json();
                    setUserName(data.user.username); // ユーザー名を状態にセット
                } else {
                    console.error("Failed to fetch user data");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchUserData();
    }, []);

    return (
        <div>
            <h1>Discord Activity</h1>
            {!userName ? (
                <button onClick={() => (window.location.href = "/api/login")}>Login with Discord</button>
            ) : (
                <div>
                    <p>Welcome, {userName}!</p>
                </div>
            )}
        </div>
    );
}
