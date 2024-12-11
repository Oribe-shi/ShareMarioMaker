import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { DISCORD_CLIENT_ID, DISCORD_REDIRECT_URI } = process.env;
    const discordAuthURL = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(
        DISCORD_REDIRECT_URI!
    )}&response_type=code&scope=identify`;

    res.redirect(discordAuthURL);
}
