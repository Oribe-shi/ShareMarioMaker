import fs from "fs";
import path from "path";
import { getSession } from "next-auth/react";

export async function getServerSideProps(context: any) {
    // セッションからユーザー情報を取得
    const session = await getSession(context);

    // セッションがない、またはユーザー名がない場合はログインページにリダイレクト
    if (!session || !session.user?.name) {
        return {
            redirect: {
                destination: "/api/auth/signin",
                permanent: false,
            },
        };
    }

    // public/index.htmlの読み込み
    const filePath = path.join(process.cwd(), "public", "index.html");
    let htmlContent = fs.readFileSync(filePath, "utf8");

    // 動的にユーザー名を埋め込む
    const userName = session.user.name;
    htmlContent = htmlContent.replace(
        '<h1 id="welcome-message">Write UserName Here :</h1>',
        `<h1 id="welcome-message">ようこそ、${userName}さん！</h1>`
    );

    return {
        props: { htmlContent },
    };
}

export default function Home({ htmlContent }: { htmlContent: string }) {
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <div id="app" dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </main>
        </div>
    );
}
