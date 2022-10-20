import { Context, InputFile } from "https://deno.land/x/grammy@v1.8.3/mod.ts";
import { Message } from "https://deno.land/x/grammy@v1.8.3/platform.deno.ts";
import tempDirectory from "https://deno.land/x/temp_dir@v1.0.0/mod.ts"
import { Handler } from "../handlers.ts";
import { YTDLPOutput } from "./yt-dlp-output.ts";

export class YTDLPHandler implements Handler {
    readonly engine: 'youtube-dl' | 'yt-dlp' = 'yt-dlp';
    constructor (private url: string, private id: string, private ctx: Context) {
    }

    async tryAndSendVideo() {
        let msg: Message.VideoMessage | null = null;
        try {
            const info = await this.getSimulatedInfo();
            if (info?.filesize && info?.filesize > (50 * 1000 * 1000)) {
                return msg;
            } else if (info?.url) {
                try {
                    msg = await this.ctx.replyWithVideo(info.url);
                } catch (e) {
                    msg = await this.downloadAndSendVideo();
                }
            } else {
                msg = await this.downloadAndSendVideo();
            }
        } catch (e) {
            console.log(e);
        }
        return msg;
    }

    private async downloadAndSendVideo() {
        console.log ('Downloading');
        const download = await this.downloadVideo();
        const fileDirectory = tempDirectory + '/' + download?.filename;
        let msg: Message.VideoMessage | null = null;
        try {
            const inputFile = new InputFile(fileDirectory)
            msg = await this.ctx.replyWithVideo(inputFile);
        } catch (e) {
            console.log(e);
        } finally {
            await Deno.remove(fileDirectory);
        }
        return msg;
    }

    private getSimulatedInfo() {
        return this.runWithCommands(['-j']);
    }

    private downloadVideo() {
        return this.runWithCommands(this.engine === 'youtube-dl' ? ['--print-json'] : ['-j', '--no-simulate']);
    }

    private async runWithCommands(commands: string[] = []) {
        const ytdlp = Deno.run({
            cmd: [this.engine, ...commands, '-o', `${this.id}.%(ext)s`, this.url],
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
            ytdlp.close();
            return finalOutput;
        } else {
            const text = new TextDecoder().decode(stderr);
            console.log(text);
            ytdlp.close();
            return null;
        }
    }
}
