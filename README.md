# FakeYou.ts

![FakeYou.ts logo](https://github.com/jack3898/fakeyou.ts/assets/28375223/c76748e2-0456-4ed9-af06-6a84139e8f51)

A modern, light and easy-to-use API wrapper for FakeYou. Get your app up and running with FakeYou in minutes!

NOTE: This library is a work in progress and is in pre-release, that being said, it should have enough features to suit a TTS application! Things are of course subject to change.

## Installation

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
        "module": "ESNext"
    }
}
```

## Usage

```ts
import Client from "fakeyou.ts";
```

```ts
const client = new Client();

await client.login({
    username: "your username",
    password: "your password",
});

const model = await client.model.fetchModelByToken("TM:4e2xqpwqaggr");
const audio = await model?.infer("hello!");

const download = await audio.toDisk("./local/name.wav"); // or toBuffer, toBase64 or just the raw url!
```

## Features

| Name                               | Description                                                                                  | Status |
| ---------------------------------- | -------------------------------------------------------------------------------------------- | ------ |
| FakeYou login support              | Ability to take advantage of any potential premium benefits                                  | ✅     |
| Fetch models                       | Fetch models, and view their info, and do your own TTS                                       | ✅     |
| Model TTS download                 | Download as buffer, base64, or directly to disk                                              | ✅     |
| Fetch model categories             | Fetch categories, child categories and parent categories and their models                    | ✅     |
| View and edit user profiles        | View user profiles, and edit profiles you are privileged to edit (like your own)             | ✅     |
| Leaderboards                       | Fetch users from the leaderboard                                                             | ✅     |
| Global FakeYou queue stats         | Simple fetch of queue statistics                                                             | ✅     |
| Subscription details               | View your subscription details and loyalty status                                            | ✅     |
| View TTS audio history on profiles | View profile TTS audio history, and get associated model details, re-download audio and more | ✅     |

... and I will keep this list up to date with more features to come.

## Q&A

### My project uses CommonJS (`require` instead of `import`), will this package work?

No. Projects nowadays should be looking to move away from the legacy CommonJS module system. If you use TypeScript or another transpilation tool, you may be able to convert your project to ESModules and interoperate with CommonJS packages (in TypeScript there is the `esModuleInterop` flag you can set to true).

### My project uses ESModule syntax, but compiles to CommonJS in post, will this package work?

If the resulting code is CommonJS this package will not be compatible.

### Do you plan to support CommonJS?

No, sorry. 😔

### Will this work with my JS-only project?

No need to worry, it will work just fine with JS! You still get all of the types out of the box even with JS, but you won't be able to take full advantage of the amazing benefits of types.

### Do I need to log in to my FakeYou account to use this package?

It's totally optional. You can still request TTS, but you will be missing out on any premium benefits and linking your TTS history to your account.

### What versions of Node.js do you support?

I have not tested anything above Node.JS LTS (v18 as of writing).

### Does it work in the browser?

No, unfortunately. 😔 It is best you create your own web server that uses this package to build your app.
