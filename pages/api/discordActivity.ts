// discordActivity.ts
import { Client, GatewayIntentBits, ActivityType } from "discord.js"; // ActivityType と GatewayIntentBits をインポート

// ActivityTypeをstringからActivityTypeに変換する関数を定義
const mapToActivityType = (activity: string): ActivityType | undefined => {
    switch (activity) {
        case "Playing":
            return ActivityType.Playing;
        case "Streaming":
            return ActivityType.Streaming;
        case "Listening":
            return ActivityType.Listening;
        case "Watching":
            return ActivityType.Watching;
        case "Custom":
            return ActivityType.Custom;
        case "Competing":
            return ActivityType.Competing;
        default:
            return undefined; // 無効な文字列の場合
    }
};

// ここで文字列のアクティビティタイプを使用する場合
const activityTypeString: string = "Playing"; // 任意の文字列（例えば、"Playing"）

// mapToActivityTypeを使ってActivityTypeに変換
const activityType: ActivityType | undefined = mapToActivityType(activityTypeString);

// Discordクライアントの初期化
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, // Guilds intent
        GatewayIntentBits.GuildMessages, // GuildMessages intent
        GatewayIntentBits.MessageContent, // MessageContent intent (v14+)
    ],
});

client.on("ready", () => {
    console.log(`Logged in as ${client.user?.tag}!`);

    // Discordアクティビティの設定
    if (activityType !== undefined) {
        client.user?.setActivity("Your Activity Message", { type: activityType });
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);
