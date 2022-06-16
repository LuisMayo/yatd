import { Context } from "https://deno.land/x/grammy@v1.8.3/mod.ts";
import { Message } from "https://deno.land/x/grammy@v1.8.3/platform.deno.ts";
import { CacheHandler } from "./database/cache-handler.ts";
import { YTDLPHandler } from "./ytdl/yt-dlp-handler.ts";

export type HandlerList = 'ytp' | 'db';
export interface Handler {
    tryAndSendVideo(): Promise<Message.VideoMessage | null>;
}


export function HandlerFactory (type: HandlerList, args: {url: string, id: string, ctx: Context}): Handler {
    switch(type) {
        case 'ytp':
        default:
            return new YTDLPHandler(args.url, args.id, args.ctx);
        case 'db':
            return new CacheHandler(args.url, args.ctx);
    }
}