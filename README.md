# YATD - Yet Another telegram downloader
Just another bot to download videos from telegram. This one works in groups. Currently on [TG](https://t.me/groupdlbot)
It works by checking each URL against yt-dlp and trying to download the videos with it. It tries to it as efficient as possible in the following way:
1. If `MONGODB` is available, it checks against it in case this URL has already been processed
2. else, it tries to use `ytp-dl` to get an URL and send that URL to Telegram API
3. else it downloads the file with `yt-dlp` and sends it

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

### Settings
- `BOT_TOKEN`: Required, Telegram's Bot token
- `MONGODB`: Optional. Mongo Database URL. If present it will use the database as a cache to avoid using ytp twice for the same video

## Contributing
Since this is a tiny project we don't have strict rules about contributions. Just open a Pull Request to fix any of the project issues or any improvement you have percieved on your own. Any contributions which improve or fix the project will be accepted as long as they don't deviate too much from the project objectives. If you have doubts about whether the PR would be accepted or not you can open an issue before coding to ask for my opinion
