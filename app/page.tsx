"use client";

import React, { useState, useEffect } from "react";
import { DiscordSDK } from "@discord/embedded-app-sdk";

export default function Home() {
    const [userName, setUserName] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [frameId, setFrameId] = useState<string | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    useEffect(() => {
        const initializeDiscordSdk = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const frameIdFromUrl = urlParams.get("frame_id");
            setFrameId(frameIdFromUrl);

            const tokenFromUrl = urlParams.get("access_token");
            setAccessToken(tokenFromUrl);

            // frame_idとaccess_tokenが無ければエラーメッセージを設定
            if (!frameIdFromUrl || !tokenFromUrl) {
                setError("Frame ID or Access Token is missing.");
                return;
            }

            // DiscordSDKの初期化
            const discordSdk = new DiscordSDK(process.env.DISCORD_CLIENT_ID!);

            try {
                await discordSdk.ready();
                const auth = await discordSdk.commands.authenticate({
                    access_token: tokenFromUrl,
                });

                if (auth === null) {
                    setError("Authentication failed.");
                    return;
                }

                setUserName(auth.user.username);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError("Failed to initialize Discord SDK.");
                }
            }
        };

        // DiscordSDKの初期化
        initializeDiscordSdk();
    }, []);

    return (
        <div style={{ fontFamily: "Arial, sans-serif", textAlign: "center", marginTop: "50px" }}>
            <h1>Discord Activity</h1>

            {/* frame_idの表示 */}
            <p>{frameId ? `Frame ID: ${frameId}` : "No Frame ID found in the URL."}</p>

            {/* access_tokenの表示 */}
            <p>{accessToken ? `Access Token: ${accessToken}` : "No Access Token found in the URL."}</p>

            {/* エラーメッセージまたはユーザー名 */}
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
