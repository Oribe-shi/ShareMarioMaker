"use client";

import React, { useState, useEffect } from "react";

export default function Home() {
    const [userName, setUserName] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch("/api/callback"); // サーバーのエンドポイントを呼び出す
                if (response.ok) {
                    const data = await response.json();
                    setUserName(data.username); // 取得したユーザー名をセット
                } else {
                    setError("Failed to fetch user data. Please try again.");
                }
            } catch (error) {
                console.error("Error:", error);
                setError("An unexpected error occurred. Please try again later.");
            }
        };

        fetchUserData();
    }, []);

    return (
        <div>
            <h1>Discord Activity</h1>
            {!userName ? (
                <div>
                    {error ? (
                        <p style={{ color: "red" }}>{error}</p>
                    ) : (
                        <p>Please log in to see your Discord username.</p>
                    )}
                    <button
                        onClick={() => (window.location.href = "/api/login")}
                        style={{
                            padding: "10px 20px",
                            fontSize: "16px",
                            backgroundColor: "#7289da",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}
                    >
                        Login with Discord
                    </button>
                </div>
            ) : (
                <div>
                    <p>Welcome, {userName}!</p>
                </div>
            )}
        </div>
    );
}
