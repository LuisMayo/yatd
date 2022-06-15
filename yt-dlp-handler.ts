import tempDirectory from "https://deno.land/x/temp_dir@v1.0.0/mod.ts"
import { YTDLPOutput } from "./yt-dlp-output.ts";

export class YTDLPHandler {
    readonly engine: 'youtube-dl' | 'yt-dlp' = 'yt-dlp';
    constructor (private url: string, private id: string) {

    }

    getSimulatedInfo() {
        return this.runWithCommands(['-j']);
    }

    downloadVideo() {
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
