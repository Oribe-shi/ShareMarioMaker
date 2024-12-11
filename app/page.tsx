"use client";

import React, { useState, useEffect } from "react";
import { DiscordSDK } from "@discord/embedded-app-sdk";

export default function Home() {
    const [userName, setUserName] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [frameId, setFrameId] = useState<string | null>(null);

    useEffect(() => {
        const initializeDiscordSdk = async () => {
            // URLのクエリパラメータを取得
            const urlParams = new URLSearchParams(window.location.search);

            // 'frame_id'がクエリに含まれているか確認
            const frameIdFromUrl = urlParams.get("frame_id");
            setFrameId(frameIdFromUrl);

            if (!frameIdFromUrl) {
                console.log("frame_id is not present in the URL.");
            } else {
                console.log("frame_id:", frameIdFromUrl);
            }

            const discordSdk = new DiscordSDK(process.env.DISCORD_CLIENT_ID!);

            try {
                // DiscordSDKの初期化を待機
                await discordSdk.ready();

                // 認証情報の取得
                const auth = await discordSdk.commands.authenticate({
                    access_token: urlParams.get("access_token") || "",
                });

                if (auth === null) {
                    setError("Authentication failed.");
                    return;
                }

                // ユーザー情報の取得
                setUserName(auth.user.username);
            } catch (error) {
                console.error("Error initializing Discord SDK", error);
                setError("Failed to initialize Discord SDK.");
            }
        };

        // DiscordSDKの初期化
        initializeDiscordSdk();
    }, []);

    return (
        <div style={{ fontFamily: "Arial, sans-serif", textAlign: "center", marginTop: "50px" }}>
            <h1>Discord Activity</h1>
            {/* frame_idを表示 */}
            <p>{frameId ? `Frame ID: ${frameId}` : "No frame_id found in the URL."}</p>

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
