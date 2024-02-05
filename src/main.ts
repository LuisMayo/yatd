import { HandlerFactory, HandlerList } from "./handlers.ts";

import { Bot } from "https://deno.land/x/grammy@v1.8.3/mod.ts";
import { DBCache } from "./database/cache.ts";

/**
 * List pof handlers we can use to try and send the video from URL
 */
const handlers: HandlerList[] = ['ytp'];
if (!Deno.env.get('BOT_TOKEN')) {
    Deno.exit(1);
}

// If we have mongo we may use a db handler
if (Deno.env.get('MONGODB')) {
    handlers.unshift('db');
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
        const url = ctx.message.text.substring(info.offset, info.offset + info.length);
        if (!url.startsWith("https://x.com") && !url.startsWith("https://twitter.com")) {
            urls.push(url);
        }
    }
    console.log(urls);
    let i = 0;
    for (const url of urls) {
        // We try all handlers until one succeds
        for (const handlerName of handlers) {
            const handler = HandlerFactory(handlerName, {url, id: uniqueId + i, ctx});
            const success = await handler.tryAndSendVideo();
            if (success) {
                console.log('Achieved with module', handlerName);
                const db = await DBCache.getInstance();
                // We put in cache the file ID so the db handler has a better chance to work
                db.putInCache(url, success.video.file_id);
                // We break since we don't need to keep trying
                break;
            }
        }
        i++;
    }
});


// Launch!
bot.start();
