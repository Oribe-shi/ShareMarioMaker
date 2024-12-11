// app/index.tsx
"use client";

import React, { useState, useEffect } from "react";
import { DiscordSDK } from "@discord/embedded-app-sdk";
import Image from "next/image";

interface Guild {
    id: string;
    icon: string | null; // icon can be null if the guild has no icon
}

interface Auth {
    user: {
        username: string;
    };
}

export default function Home() {
    const [userName, setUserName] = useState<string | null>(null);
    const [guildIcon, setGuildIcon] = useState<string | null>(null);
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
            const auth = (await discordSdk.commands.authenticate({ access_token: accessToken })) as Auth;

            if (auth == null) {
                throw new Error("Authentication failed");
            }

            // Use user info from auth response
            setUserName(auth.user.username);

            // ギルド情報を取得
            const guildsRes = await fetch(`https://discord.com/api/v10/users/@me/guilds`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });

            const guildsJson = (await guildsRes.json()) as Guild[];
            const currentGuild = guildsJson.find((guild: any) => guild.id === discordSdk.guildId);

            if (currentGuild) {
                setGuildIcon(`https://cdn.discordapp.com/icons/${currentGuild.id}/${currentGuild.icon}.webp?size=128`);
            }
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
                    {guildIcon && <Image src={guildIcon} alt="Guild Icon" width={128} height={128} />}
                </div>
            )}
        </div>
    );
}
