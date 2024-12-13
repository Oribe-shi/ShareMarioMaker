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

            const discordSdk = new DiscordSDK(process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!);

            try {
                // SDKの初期化
                await discordSdk.ready();

                // 認証コードの取得
                const { code } = await discordSdk.commands.authorize({
                    client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!,
                    response_type: "code",
                    state: "",
                    prompt: "none",
                    scope: ["identify"],
                });

                console.log("ShareMarioMaker - GetUserName");

                // サーバーからアクセストークンを取得
                const response = await fetch("/api/token", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ code }),
                });

                console.log("ShareMarioMaker - GetUserName");

                const text = await response.text(); // レスポンスをテキストとして取得して確認
                console.log(text); // レスポンスの内容をログに出力

                const { access_token } = JSON.parse(text); // 文字列として受け取ったレスポンスをパース

                // アクセストークンを使用して認証
                const auth = await discordSdk.commands.authenticate({
                    access_token,
                });

                if (!auth) {
                    setError("Authentication failed.");
                    return;
                }

                // ユーザー情報の取得
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
