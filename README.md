# FakeYou.ts

![FakeYou.ts logo](https://github.com/jack3898/fakeyou.ts/assets/28375223/c76748e2-0456-4ed9-af06-6a84139e8f51)

A modern, light, 100% type-safe, and easy-to-use unofficial API wrapper for [FakeYou](https://fakeyou.com/) with [Node.js](https://nodejs.org). Get your app up and running with FakeYou in minutes!

## Installation

NOTE: Node v18 and higher is only supported.

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

const model = await client.fetchTtsModelByToken('TM:4e2xqpwqaggr');
const inference = await model?.infer('hello!');

await inference?.toDisk('./local/name.wav'); // or toBuffer, toBase64 or just the raw URL!
```

## Or voice-to-voice!

Fakeyou.ts is the only Node package to support voice-to-voice!

```ts
import Client from 'fakeyou.ts';
import { readFileSync } from 'node:fs';

const client = new Client();

const model = await client.fetchV2vModelByToken('vcm_tes015h65n6h');
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

No. This package is meant to be used with bleeding-edge JS, to keep things standardized and simple!

### My project uses ESModule syntax, but compiles to CommonJS in post, will this package work?

If the resulting code is CommonJS this package will not be compatible.

### Do you plan to support CommonJS?

No, sorry. 😔 Projects nowadays should be looking to move away from the legacy CommonJS module system. If you use TypeScript or another transpilation tool, you may be able to convert your project to ESModules and interoperate with CommonJS packages (in TypeScript there is the `esModuleInterop` flag you can set to true). Or you can dynamically import this package with `await import()`.

### Will this work with my JS-only project?

Yes! You still get all of the types out of the box even with JS, but you won't be able to take full advantage of the amazing benefits of types.

### Do I need to log in to my FakeYou account to use this package?

Nope! As an anonymous user, you can still request TTS, but you will be missing out on any premium benefits and linking your TTS history to your account and some methods like `client.fetchLoggedInUser()` will return `undefined`.

### What versions of Node.js do you support?

Node.js v18 and up are the only versions of Node.js that this package supports. You will know if you have an invalid version, because npm will say `EBADENGINE` upon install.

This package aims for LTS support, and will deprecate any versions under LTS.

### Does it work in the browser?

No, unfortunately. 😔 It is best you create your own web server that uses this package to build your app.

Interestingly, the packages this project depends on are cross-platform, and it uses JS-native APIs when available like `crypto` and `fetch` so if CORS did not exist, I could tweak this project in only a few hours for first-class browser support. This package is 99% ready! CORS is just the blocker.

### Does it work with Deno?

In theory, it should! But I haven't tried. Deno has first-class support for npm modules, so it should be possible.

If you have tried it, let me know, and I will update this README!

### Why this over fakeyou.**js**?

Fakeyou.js is a great project (if you haven't seen it, you can check it out [here!](https://github.com/leunamcrack/fakeyou.js/)) but I wrote this package to address its shortcomings. For example and in comparison, fakeyou.ts is...

-   [x] Safe; All API responses are validated at runtime with type-smart schemas, which provides type-safety guarantees as well as the package just being fully type-safe. When using this package you will get autocomplete for every function, types for every return and compile-time errors for improper usage. No fragile conditional checks spread throughout the code.
-   [x] End-to-end and unit tested; Before this package is deployed or pull-requests merged, a branch must pass through user-simulated automated tests to reduce the likelihood of deploying bugs.
-   [x] Optimised and memory safe; Memory safe?!?! For JS?? A garbage collected language?! Yes! (well sort of, you don't have the same amount of control as other languages out there but this package does what it can.) Thanks to smart use of caching, searching for a model by name OR by token will return the exact same instance of the object in memory, so you are never creating unwanted garbage in the background and doing more work than is what is required. This does not just apply to models, but all other types of data too. The cache has a maximum capacity of ~500MB, with an object TTL of 10 minutes and stores no more than 5000 objects at a time.
-   [x] Scalable; All classes and components are all independent from one-another, making refactors and feature additions easy. Composition is favoured over inheritance with isolated implementation functions.
-   [x] Feature-rich; Fakeyou.ts is the most powerful NPM package available for Node.js (as of writing 🤣).
-   [x] Modern; Fakeyou.ts works with ESModules, supporting next-generation JavaScript projects and supports top-level await.
-   [x] Easy to work with; Not only does fakeyou.ts give you type-safety guarantees, it has a logging flag you can enable to inspect all of its network traffic, and if you're unfortunate enough, see nicely-formatted errors. I know that unhelpful errors are an absolute pain, so this package takes is seriously so any bugs or problems can be addressed as quickly as possible.
-   [x] Active on Discord; The maintainer (me!) of this project is active on FakeYou's official Discord! If there are any problems you are having, you can either contact me there (#api channel) or submit an issue on this GitHub page. Make sure to tag me so I don't miss you! For safety reasons I will not display my discord tag here.
-   [x] Highly documented; The code takes big advantage of JSDoc, to not only provide inline documentation while you code, but public documentation which is generated and published by an automated CI pipeline. https://fakeyouts.js.org/.
