import NextAuth, { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

export const authOptions: NextAuthOptions = {
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (session.user) {
                // session.user が存在する場合に id を追加
                session.user.id = token.sub ?? ""; // トークンの sub を設定（ない場合は空文字列）
            }
            return session;
        },
        async jwt({ token, account }) {
            if (account) {
                token.sub = account.providerAccountId; // トークンに providerAccountId を設定
            }
            return token;
        },
    },
};

export default NextAuth(authOptions);
