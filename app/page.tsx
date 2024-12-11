// app/page.tsx
"use client";

import { useEffect, useState } from "react";

export default function Home() {
    const [participants, setParticipants] = useState<any[]>([]);

    useEffect(() => {
        async function fetchParticipants() {
            const response = await fetch("/api/discordActivity");
            const data = await response.json();
            setParticipants(data.participants);
        }

        fetchParticipants();
    }, []);

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <div id="app">
                    {participants.length > 0 ? (
                        participants.map((participant, index) => (
                            <div key={index}>
                                <h2>{participant.username}</h2>
                                <img src={participant.avatarURL} alt={participant.username} />
                            </div>
                        ))
                    ) : (
                        <p>参加者がいません</p>
                    )}
                </div>
            </main>
        </div>
    );
}
