import tempDirectory from "https://deno.land/x/temp_dir@v1.0.0/mod.ts"
import { YTDLPOutput } from "./yt-dlp-output.ts";

export class YTDLPHandler {
    constructor (private url: string, private id: string) {

    }

    getSimulatedInfo() {
        return this.runWithCommands();
    }

    downloadVideo() {
        return this.runWithCommands(['--no-simulate']);
    }

    private async runWithCommands(commands: string[] = []) {
        const ytdlp = Deno.run({
            cmd: ['yt-dlp', '-j', `-o ${this.id}.$(ext)s`, ...commands, this.url],
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
            console.log(stderr);
            ytdlp.close();
            return null;
        }
    }
}
