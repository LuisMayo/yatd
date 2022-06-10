import tempDirectory from "https://deno.land/x/temp_dir@v1.0.0/mod.ts"
import { YTDLPOutput } from "./yt-dlp-output.ts";

export class YTDLPHandler {
    constructor (private url: string, private id: string) {

    }

    async getSimulatedInfo() {
        const [status, stdout, stderr] = await this.runWithCommands();
        if (status.success) {
            const json = new TextDecoder().decode(stdout);
            const finalOutput: YTDLPOutput = JSON.parse(json);
            return finalOutput;
        } else {
            console.log(stderr);
            return null;
        }
    }

    private runWithCommands(commands: string[] = []) {
        const ytdlp = Deno.run({
            cmd: ['yt-dlp', '-j', `-o ${this.id}.$(ext)s`, ...commands, this.url],
            stdin: 'null',
            stderr: 'piped',
            stdout: 'piped',
            cwd: tempDirectory
        });
        return Promise.all([
            ytdlp.status(),
            ytdlp.output(),
            ytdlp.stderrOutput()
        ]);
    }
}