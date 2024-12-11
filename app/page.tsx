"use client";

import React, { useState, useEffect } from "react";

export default function Home() {
    const [userName, setUserName] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true); // ローディング状態を追加

    // 認証済みのユーザー情報を取得する関数
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch("/api/callback"); // サーバーのエンドポイントを呼び出す
                if (response.ok) {
                    const data = await response.json();
                    setUserName(data.username); // ユーザー名をdata.usernameからセット
                } else {
                    setError("Failed to fetch user data. Please try again.");
                }
            } catch (error) {
                console.error("Error:", error);
                setError("An unexpected error occurred. Please try again later.");
            } finally {
                setLoading(false); // ローディング完了
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return (
            <div style={{ fontFamily: "Arial, sans-serif", textAlign: "center", marginTop: "50px" }}>
                <h1>Discord Activity</h1>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div style={{ fontFamily: "Arial, sans-serif", textAlign: "center", marginTop: "50px" }}>
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
                    <p style={{ fontSize: "20px" }}>
                        Welcome, <strong>{userName}</strong>!
                    </p>
                </div>
            )}
        </div>
    );
}
