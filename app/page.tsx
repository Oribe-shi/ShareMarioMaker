// app/index.tsx
"use client";

import React, { useState, useEffect } from "react";
import { DiscordSDK } from "@discord/embedded-app-sdk";

export default function Home() {
    const [userName, setUserName] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get("access_token");

        if (accessToken) {
            setupDiscordSdk(accessToken);
        } else {
            setError("Failed to retrieve user data.");
        }
    }, []);

    const setupDiscordSdk = async (accessToken: string) => {
        const client_id = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
        if (!client_id) throw new Error("Discord client ID not configured");

        const discordSdk = new DiscordSDK(client_id);

        try {
            await discordSdk.ready();
            const auth = await discordSdk.commands.authenticate({ access_token: accessToken });

            if (auth == null) {
                throw new Error("Authentication failed");
            }

            // Use user info from auth response
            setUserName(auth.user.username);
        } catch (error) {
            console.error(error);
            setError("Failed to setup Discord SDK");
        }
    };

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
