import { useState } from "react";
import { useSession } from "next-auth/react";

export default function Home() {
    const { data: session } = useSession();
    const [activity, setActivity] = useState("");

    const handleActivityChange = async () => {
        if (!session) return;

        const res = await fetch("/api/discordActivity", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ activity }),
        });

        if (res.ok) {
            alert("Discord Activity updated successfully!");
        } else {
            alert("Failed to update activity.");
        }
    };

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <h1>ようこそ、{session?.user?.name}さん！</h1>
                <div>
                    <input
                        type="text"
                        placeholder="Set Discord Activity"
                        value={activity}
                        onChange={(e) => setActivity(e.target.value)}
                    />
                    <button onClick={handleActivityChange}>Update Activity</button>
                </div>
            </main>
        </div>
    );
}
