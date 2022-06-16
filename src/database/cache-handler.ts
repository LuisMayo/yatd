import { Context } from "https://deno.land/x/grammy@v1.8.3/mod.ts";
import { Message } from "https://deno.land/x/grammy@v1.8.3/platform.deno.ts";
import { Handler } from "../handlers.ts";
import { DBCache } from "./cache.ts";

export class CacheHandler implements Handler {
    constructor (private url: string, private ctx: Context) {

    }
    async tryAndSendVideo(): Promise<Message.VideoMessage | null> {
        let msg: Message.VideoMessage | null = null;
        try {
            const db = await DBCache.getInstance();
            const result = await db.getFromCache(this.url);
            if (result) {
                try {
                    msg = await this.ctx.replyWithVideo(result.file_id);
                } catch (e) {
                    // For some reason the file id didn't work, we delete it
                    db.removeFromCache(this.url);
                }
            }
        } catch (e) {
            console.log(e);
        }
        return msg;
    }

}