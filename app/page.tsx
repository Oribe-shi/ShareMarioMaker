"use client";

import React, { useState, useEffect } from "react";
import { DiscordSDK } from "@discord/embedded-app-sdk";
import { DiscordProxy } from "@robojs/patch"; // 追加

export default function Home() {
    const [userName, setUserName] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [frameId, setFrameId] = useState<string | null>(null);

    useEffect(() => {
        // DiscordProxy.patch() を最初に呼び出す
        DiscordProxy.patch();

        const initializeDiscordSdk = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const frameIdFromUrl = urlParams.get("frame_id");
            setFrameId(frameIdFromUrl);

            const discordSdk = new DiscordSDK(process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!);

            try {
                await discordSdk.ready();

                const { code } = await discordSdk.commands.authorize({
                    client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!,
                    response_type: "code",
                    state: "",
                    prompt: "none",
                    scope: ["identify"],
                });

                console.log("Authorization Code:", code);

                // JSON.stringify の結果を確認
                const requestBody = JSON.stringify({ code });
                console.log("Request Body (JSON):", requestBody);

                // サーバーにリクエストを送信
                const response = await fetch("/api/token", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: requestBody,
                });

                // レスポンスを確認
                console.log("Response Status:", response.status);
                const text = await response.text();
                console.log("Response Text:", text);

                // JSONに変換してアクセストークンを取得
                const { access_token } = JSON.parse(text);
                console.log("Access Token:", access_token);

                // アクセストークンで認証
                const auth = await discordSdk.commands.authenticate({
                    access_token,
                });

                if (!auth) {
                    setError("Authentication failed.");
                    return;
                }

                const user = await fetch("https://discord.com/api/v10/users/@me", {
                    headers: {
                        Authorization: `Bearer ${auth.access_token}`,
                        "Content-Type": "application/json",
                    },
                }).then((response) => response.json());

                setUserName(user.global_name || user.username);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    console.error("Error initializing Discord SDK", error);
                    setError("Failed to initialize Discord SDK.");
                }
            }
        };

        initializeDiscordSdk();
    }, []);

    return (
        <div style={{ fontFamily: "Arial, sans-serif", textAlign: "center", marginTop: "50px" }}>
            <h1>Discord Activity</h1>
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
