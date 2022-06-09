import tempDirectory from "https://deno.land/x/temp_dir@v1.0.0/mod.ts"
import { Bot, InputFile } from "https://deno.land/x/grammy@v1.8.3/mod.ts";
import { YTDLPOutput } from "./yt-dlp-output.ts";

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
    for (const url of urls) {
        try {
            const ytdlp = Deno.run({
                cmd: ['yt-dlp', '-j', `-o ${uniqueId}.$(ext)s`, '--no-simulate', url],
                stdin: 'null',
                stderr: 'piped',
                stdout: 'piped',
                cwd: tempDirectory
            });
            const [status, stdout, stderr] = await Promise.all([
                ytdlp.status(),
                ytdlp.output(),
                ytdlp.stderrOutput()
            ]);
            if (status.success) {
                const json = new TextDecoder().decode(stdout);
                const finalOutput: YTDLPOutput = JSON.parse(json);
                const fileDirectory = tempDirectory + '/' + finalOutput.filename;
                const inputFile = new InputFile(fileDirectory);
                await ctx.replyWithVideo(inputFile);
                await Deno.remove(fileDirectory);
            } else {
                const show = new TextDecoder().decode(stderr);
                console.log(show);
            }
            ytdlp.close();
        } catch (e) {
            console.log(e);
        }
    }
});

// Launch!
bot.start();
