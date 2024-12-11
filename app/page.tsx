// app/page.tsx
"use client";

import { useEffect, useState } from "react";

export default function Home() {
    const [userInfo, setUserInfo] = useState<{ username: string; avatar: string } | null>(null);

    useEffect(() => {
        async function fetchUserInfo() {
            const response = await fetch("/api/discord");
            const data = await response.json();
            if (data.username && data.avatar) {
                setUserInfo(data);
            }
        }
        fetchUserInfo();
    }, []);

    return (
        <div>
            <h1>Discord Activity</h1>
            {userInfo ? (
                <div>
                    <p>Username: {userInfo.username}</p>
                    <img src={userInfo.avatar} alt="User Avatar" />
                </div>
            ) : (
                <p>Loading user info...</p>
            )}
        </div>
    );
}
