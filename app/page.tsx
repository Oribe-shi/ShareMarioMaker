"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Home() {
    const searchParams = useSearchParams();
    const usernameParam = searchParams.get("username");
    const errorParam = searchParams.get("error");

    const [userName, setUserName] = useState<string | null>(usernameParam);
    const [error, setError] = useState<string | null>(errorParam);

    return (
        <div>
            <h1>Discord Activity</h1>
            {!userName ? (
                <div>
                    <button
                        onClick={() =>
                            (window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${
                                process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID
                            }&redirect_uri=${encodeURIComponent(
                                `${process.env.NEXT_PUBLIC_BASE_URL}/api/callback`
                            )}&response_type=code&scope=identify`)
                        }
                    >
                        Login with Discord
                    </button>
                    {error && <p style={{ color: "red" }}>Error: {error}</p>}
                </div>
            ) : (
                <div>
                    <p>Welcome, {userName}!</p>
                </div>
            )}
        </div>
    );
}
