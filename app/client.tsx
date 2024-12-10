// client.tsx
"use client"; // クライアントサイドコンポーネント

import { useEffect, useState } from "react";

export default function ClientComponent() {
    const [htmlContent, setHtmlContent] = useState<string>("");

    useEffect(() => {
        const fetchHtml = async () => {
            try {
                const response = await fetch("/api/dynamic-html", {
                    method: "GET", // 必要に応じてメソッドを設定
                    headers: {
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`, // 必要な認証トークン
                    },
                });
                if (!response.ok) throw new Error("Failed to fetch HTML content");
                const html = await response.text();
                setHtmlContent(html);
            } catch (error) {
                console.error(error);
            }
        };

        fetchHtml();
    }, []);

    return (
        <div
            id="app"
            style={{ width: "100%", height: "100%", margin: "0" }}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
    );
}
