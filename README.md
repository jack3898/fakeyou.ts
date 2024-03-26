# FakeYou.ts

![FakeYou.ts logo](https://github.com/jack3898/fakeyou.ts/assets/28375223/c76748e2-0456-4ed9-af06-6a84139e8f51)

A modern, light, 100% type-safe, and easy-to-use unofficial API wrapper for [FakeYou](https://fakeyou.com/) with [Node.js](https://nodejs.org). Get your app up and running with FakeYou in minutes! Even though it is geared around TypeScript, JavaScript users can still take full advantage of this package.

## Installation

```sh
npm install fakeyou.ts
npm pkg set type=module
```

If you use TypeScript it is recommended to include this in your `tsconfig.json`:

```json
{
	"extends": "fakeyou.ts/tsconfig.recommended.json"
}
```

## Text-to-speech usage

```ts
import Client from 'fakeyou.ts';

const client = new Client();

const model = await client.fetchTtsModelByName('Squidward');
const inference = await model?.infer('hello!');

await inference?.toDisk('./local/name.wav'); // or toBuffer, toBase64 or just the raw URL!
```

## Or voice-to-voice!

Fakeyou.ts is the only Node package to support voice-to-voice!

```ts
import Client from 'fakeyou.ts';
import { readFileSync } from 'node:fs';

const client = new Client();

const model = await client.fetchV2vModelByName('Squidward');
const audioFile = readFileSync('./localAudioFile.wav'); // Wav is only supported for simplicity, as validating the type is not reliable
const inference = await model?.infer(audioFile);

await inference?.toDisk('./local/name.wav'); // Same API as TTS!
```

## Login to FakeYou

You may optionally log in to take advantage of reduced rate limits, premium benefits, faster processing times and more.

```ts
import Client from 'fakeyou.ts';

const client = new Client();

await client.login({
	username: 'your username',
	password: 'your password',
});
```

Or set `FAKEYOU_COOKIE` as an environment variable containing your cookie and it will automatically log in. You may override the environment cookie with the above `login()` method.

## Features

| Name                               | Description                                                                                      | Status |
| ---------------------------------- | ------------------------------------------------------------------------------------------------ | ------ |
| FakeYou login support (session)    | Ability to take advantage of any potential premium benefits                                      | ✅     |
| Fetch models                       | Fetch models, and view their info, and do your own TTS                                           | ✅     |
| Text-to-speech download            | Download text-to-speech as buffer, base64, or directly to disk                                   | ✅     |
| Voice-to-voice download            | Upload a voice then download the voice-to-voice inference as buffer, base64, or directly to disk | ✅     |
| Fetch model categories             | Fetch categories, child categories and parent categories and their models                        | ✅     |
| View and edit user profiles        | View user profiles, and edit profiles you are privileged to edit (like your own)                 | ✅     |
| Leaderboards                       | Fetch users from the leaderboard                                                                 | ✅     |
| Global FakeYou queue stats         | Simple fetch of queue statistics                                                                 | ✅     |
| Subscription details               | View your subscription details and loyalty status                                                | ✅     |
| View TTS audio history on profiles | View profile TTS audio history, and get associated model details, re-download audio and more     | ✅     |
| View user models on profiles       | Get a list of the user's models from their profile                                               | ✅     |

... and I will keep this list up to date with more features to come.

## Contributing

If you would like to contribute, then please read the [contributing guidelines](https://github.com/jack3898/fakeyou.ts/blob/main/.github/CONTRIBUTING.md). Thank you!

## Q&A

### My project uses CommonJS (`require` instead of `import`), will this package work?

No. This package is meant to be used with bleeding-edge JS, to keep things standardised and simple!

### My project uses ESModule syntax, but compiles to CommonJS in post, will this package work?

If the resulting code is CommonJS this package will not be compatible.

### Do you plan to support CommonJS?

No, sorry. 😔

### Will this work with my JS-only project?

Yes! No compromise interop with JS projects.

### Do I need to log in to my FakeYou account to use this package?

Nope! However, as an anonymous user, you will be at the mercy of far higher rate limits and slower processing times.

### What versions of Node.js do you support?

Node.JS LTS and up. You will know if you have an invalid version, because npm will say `EBADENGINE` upon install.

### Does it work in the browser?

No, unfortunately. 😔 It is best you create your own web server that uses this package to build your app. The only reason why is CORS.

### Does it work with Deno?

In theory, it should! But I haven't tried. Deno has first-class support for npm modules, so it should be possible.

If you have tried it, let me know, and I will update this README!

### Why this over fakeyou.**js**?

Fakeyou.js is a great project (if you haven't seen it, you can check it out [here!](https://github.com/leunamcrack/fakeyou.js/)) but I wrote this package to address its shortcomings.

Fakeyou.ts is a complete rewrite of the original package, with a focus on type-safety, scalability, testability, and modern JavaScript features. Basically, this package is better in almost every way.
