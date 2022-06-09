# YATD - Yet Another telegram downloader
Just another bot to download videos from telegram. This one works in groups. Currently on [TG](https://t.me/groupdlbot)

### Prerequisites

 - [Deno Typescript runtime](https://deno.land/)
 - Telegram bot credentials (get them from botfather)
 - [YT-DLP](https://github.com/yt-dlp/yt-dlp)

### Installing

- Clone the repository

``` bash
git clone --recursive https://github.com/LuisMayo/yatd
```

- Set the env variable BOT_TOKEN to your bot token

- Run with permissions

``` bash
deno run --allow-read --allow-write --allow-env --allow-net --allow-run main.ts
```

## Contributing
Since this is a tiny project we don't have strict rules about contributions. Just open a Pull Request to fix any of the project issues or any improvement you have percieved on your own. Any contributions which improve or fix the project will be accepted as long as they don't deviate too much from the project objectives. If you have doubts about whether the PR would be accepted or not you can open an issue before coding to ask for my opinion
