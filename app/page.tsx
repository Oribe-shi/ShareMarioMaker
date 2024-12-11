// app/page.tsx
"use client";

import React, { useEffect, useState } from "react";

const DiscordActivity = () => {
    const [userNames, setUserNames] = useState<string[]>([]);
    const [userIcons, setUserIcons] = useState<string[]>([]);

    useEffect(() => {
        const fetchActivityData = async () => {
            const response = await fetch("/api/discordActivity");
            const data = await response.json();
            setUserNames(data.userNames);
            setUserIcons(data.userIcons);
        };
        fetchActivityData();
    }, []);

    return (
        <div>
            <h2>Discord Activity - Online Users</h2>
            <ul>
                {userNames.map((name, index) => (
                    <li key={index}>
                        <img src={userIcons[index]} alt={name} width={40} height={40} />
                        {name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DiscordActivity;
