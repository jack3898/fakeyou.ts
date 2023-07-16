# FakeYou.ts

![FakeYou.ts logo](https://github.com/jack3898/fakeyou.ts/assets/28375223/c76748e2-0456-4ed9-af06-6a84139e8f51)

A modern, light, 100% type-safe, and easy-to-use unofficial API wrapper for [FakeYou](https://fakeyou.com/) with [Node.js](https://nodejs.org). Get your app up and running with FakeYou in minutes!

## Installation

NOTE: Node v18 and higher is only supported.

```bash
npm install fakeyou.ts
```

`package.json` must include:

```json
{
    "type": "module"
}
```

If you use TypeScript `tsconfig.json` must include:

```json
{
    "compilerOptions": {
        "module": "NodeNext"
    }
}
```

## Text-to-speech usage

```ts
import Client from "fakeyou.ts";

const client = new Client();

const model = await client.ttsModel.fetchModelByToken("TM:4e2xqpwqaggr");
const audio = await model?.infer("hello!");

await audio?.toDisk("./local/name.wav"); // or toBuffer, toBase64 or just the raw URL!
```

## Or voice-to-voice!

Fakeyou.ts is the only Node package to support voice-to-voice!

```ts
import Client from "fakeyou.ts";
import { readFileSync } from "node:fs";

const client = new Client();

const model = await client.v2vModel.fetchModelByToken("vcm_tes015h65n6h");
const audioFile = readFileSync("./localAudioFile.wav"); // Wav is only supported for simplicity, as validating the type is not reliable
const audio = await model?.infer(audioFile);

await audio?.toDisk("./local/name.wav"); // Same API as TTS!
```

## Login to FakeYou

You may optionally log in to take advantage of reduced rate limits, premium benefits, faster processing times and more.

```ts
import Client from "fakeyou.ts";

const client = new Client();

await client.login({
    username: "your username",
    password: "your password",
});
```

## TTS rate limiting helper

Let the client take away the stress of rate limiting with text-to-speech. Using the below approach with `Promise.all()` it will automatically and safely queue each inference so you aren't accidentally rate limited. It is important to note that the more you add, the longer it will take to complete your request (especially if you are not logged in)!

```ts
const [audio1, audio2, audio3] = await Promise.all([
    model.infer("Test!"),
    differentModel.infer("Test 2!"),
    model.infer("Test 3!"),
]);

// Do what you like with the audio files from here on!
```

And the best bit is you can mix a variety of different models within the rate limit guard, which makes it very useful for buffering up a conversation.

_The voice-to-voice rate limit guard is not yet implemented._

## Features

| Name                               | Description                                                                                      | Status |
| ---------------------------------- | ------------------------------------------------------------------------------------------------ | ------ |
| FakeYou login support (session)    | Ability to take advantage of any potential premium benefits                                      | ✅     |
| Fetch models                       | Fetch models, and view their info, and do your own TTS                                           | ✅     |
| Text-to-speech download            | Download text-to-speech as buffer, base64, or directly to disk                                   | ✅     |
| Voice-to-voice download            | Upload a voice then download the voice-to-voice inference as buffer, base64, or directly to disk | ✅     |
| TTS rate limit handling            | Tooling to help avoid the rate limiting of FakeYou's API                                         | ✅     |
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

No. This package is meant to be used with bleeding-edge JS, to keep things standardized and simple!

### My project uses ESModule syntax, but compiles to CommonJS in post, will this package work?

If the resulting code is CommonJS this package will not be compatible.

### Do you plan to support CommonJS?

No, sorry. 😔 Projects nowadays should be looking to move away from the legacy CommonJS module system. If you use TypeScript or another transpilation tool, you may be able to convert your project to ESModules and interoperate with CommonJS packages (in TypeScript there is the `esModuleInterop` flag you can set to true). Or you can dynamically import this package with `await import()`.

### Will this work with my JS-only project?

Yes! You still get all of the types out of the box even with JS, but you won't be able to take full advantage of the amazing benefits of types.

### Do I need to log in to my FakeYou account to use this package?

It's totally optional. You can still request TTS, but you will be missing out on any premium benefits and linking your TTS history to your account.

### What versions of Node.js do you support?

Node.js v18 and up are the only versions of Node.js that this package supports. You will know if you have an invalid version, because npm will say `EBADENGINE` upon install!

### Does it work in the browser?

No, unfortunately. 😔 It is best you create your own web server that uses this package to build your app.

### Why this over fakeyou.**js**?

Fakeyou.js is a great project (if you haven't seen it, you can check it out [here!](https://github.com/leunamcrack/fakeyou.js/)) but I wrote this package to address its shortcomings. For example, fakeyou.ts is...

-   [x] Safe; All API responses are validated at runtime with type-smart schemas, which provides type-safety guarantees as well as the package just being fully type-safe. When using this package you will get autocomplete for every function, types for every return and compile-time errors for improper usage.
-   [x] Scalable; All classes and components are almost all independent from one-another, making refactors and feature additions easy. No class inheritance to be found.
-   [x] Feature-rich; Not only does fakeyou.ts have pretty much the same featureset at fakeyou.js, it also supports voice-to-voice.
-   [x] Modern; Fakeyou.ts works with ESModules, supporting next-generation JavaScript projects and supports top-level await.
-   [x] Relies on packages only when it needs to; Fakeyou.ts uses native Node.js modules if they are available (like fetch).
-   [x] Smart; More implementation details are hidden away. It will contact the API only when it needs to. No need to run any `.init()` or `.start()` functions at the top of your app.
-   [x] Easy to work with; Not only does fakeyou.ts give you type-safety guarantees, it has a logging flag you can enable to inspect all of its network traffic, and if you're unfortunate enough, see nicely-formatted errors.
-   [x] Active on Discord; The maintainer (me!) of this project is active on FakeYou's official Discord! If there are any problems you are having, you can either contact me there (#api channel) or submit an issue on this GitHub page. Make sure to tag me so I don't miss you! For safety reasons I will not display my discord tag here.
