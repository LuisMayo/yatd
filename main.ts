import { Bot, Context, InputFile } from "https://deno.land/x/grammy@v1.8.3/mod.ts";
import tempDirectory from "https://deno.land/x/temp_dir@v1.0.0/mod.ts"
import { YTDLPHandler } from "./yt-dlp-handler.ts";

// Create bot object
if (!Deno.env.get('BOT_TOKEN')) {
    Deno.exit(1);
}
const bot = new Bot(Deno.env.get('BOT_TOKEN')!);
await bot.api.setMyCommands([{
    command: 'start',
    description: 'starts the bot'
},
{
    command: 'about',
    description: 'show info about the bot'
}])
// Listen for messages
bot.command("start", (ctx) => ctx.reply("Welcome! Send me a link and I'll download it"));
bot.command("about", (ctx) => ctx.reply("Made with ❤ by @TLuigi003. Source code on https://github.com/LuisMayo/yatd . Do you like my work? Invite me to a coffee on https://ko-fi.com/luismayo"));
bot.on("message:entities:url", async (ctx) => {
    const uniqueId = ctx.chat.id.toString() + ctx.message.message_id.toString();
    console.log(ctx.message.entities);
    const urlsInfo = ctx.message.entities.filter(entity => entity.type === 'url');
    const urls = [];
    for (const info of urlsInfo) {
        urls.push(ctx.message.text.substring(info.offset, info.offset + info.length));
    }
    console.log(urls);
    let i = 0;
    for (const url of urls) {
        const ytp = new YTDLPHandler(url, uniqueId + i.toString());
        try {
            const info = await ytp.getSimulatedInfo();
            if (info?.filesize && info.filesize > (50 * 1000 * 1000)) {
                // Cannot send
                return;
            } else if (info?.url) {
                try {
                    console.log('Trying URL');
                    await ctx.replyWithVideo(info.url);
                } catch (e) {
                    downloadAndSendVideo(ytp, ctx);
                }
            } else {
                downloadAndSendVideo(ytp, ctx);
            }
        } catch (e) {
            console.log(e);
        }
        i++;
    }
});

async function downloadAndSendVideo(ytp: YTDLPHandler, ctx: Context) {
    console.log ('Downloading');
    const download = await ytp.downloadVideo();
    const fileDirectory = tempDirectory + '/' + download?.filename;
    const inputFile = new InputFile(fileDirectory)
    await ctx.replyWithVideo(inputFile);
    await Deno.remove(fileDirectory);
}

// Launch!
bot.start();
