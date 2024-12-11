import fs from "fs";
import path from "path";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

interface HomeProps {
    htmlContent: string;
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async (context) => {
    // セッションを取得
    const session = await getSession(context);

    if (!session || !session.user?.name) {
        return {
            redirect: {
                destination: "/api/auth/signin", // サインインページにリダイレクト
                permanent: false,
            },
        };
    }

    // index.html の内容を読み込む
    const filePath = path.join(process.cwd(), "public", "index.html");
    let htmlContent = fs.readFileSync(filePath, "utf8");

    // ユーザー名を埋め込む
    const userName = session.user.name;
    htmlContent = htmlContent.replace(
        '<h1 id="welcome-message">Write UserName Here :</h1>',
        `<h1 id="welcome-message">ようこそ、${userName}さん！</h1>`
    );

    return {
        props: { htmlContent },
    };
};

export default function Home({ htmlContent }: HomeProps) {
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <div id="app" dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </main>
        </div>
    );
}
