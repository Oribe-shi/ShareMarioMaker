"use client";

import React, { useState, useEffect } from "react";
import { DiscordSDK } from "@discord/embedded-app-sdk";
import { DiscordProxy } from "@robojs/patch";

export default function Home() {
    const [userName, setUserName] = useState<string | null>(null);
    const [userIcon, setUserIcon] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [frameId, setFrameId] = useState<string | null>(null);

    useEffect(() => {
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

                const response = await fetch("/api/token", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ code }),
                });

                const text = await response.text();
                const { access_token } = JSON.parse(text);

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

                if (user.avatar) {
                    const iconUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
                    setUserIcon(iconUrl);
                }
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
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
                    {error ? <p style={{ color: "red" }}>{error}</p> : <p>Loading...</p>}
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
                            marginTop: "20px",
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
                    {userIcon && (
                        <img
                            src={userIcon}
                            alt={`${userName}'s avatar`}
                            style={{
                                width: "50%",
                                marginTop: "20px",
                                borderRadius: "10px",
                            }}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
