import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { code } = req.query;

    if (!code) {
        return res.status(400).json({ error: "Authorization code is missing" });
    }

    const { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_REDIRECT_URI, DISCORD_API_BASE_URL } = process.env;

    try {
        // アクセストークンの取得
        const tokenResponse = await axios.post(`${DISCORD_API_BASE_URL}/oauth2/token`, null, {
            params: {
                client_id: DISCORD_CLIENT_ID,
                client_secret: DISCORD_CLIENT_SECRET,
                grant_type: "authorization_code",
                code,
                redirect_uri: DISCORD_REDIRECT_URI,
            },
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });

        const { access_token } = tokenResponse.data;

        // ユーザー情報の取得
        const userResponse = await axios.get(`${DISCORD_API_BASE_URL}/users/@me`, {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const user = userResponse.data;
        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch user data" });
    }
}
