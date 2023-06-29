# FakeYou.ts

A modern, light (1 dependency) and easy-to-use API wrapper for FakeYou. Get your app up and running with FakeYou in minutes!

NOTE: This library is a work in progress and is in pre-release, that being said, it should have enough features to suit a basic TTS application! Things are of course subject to change.

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

`tsconfig.json` must include:

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

## Q&A

1. My project uses CommonJS (`require` instead of `import`), will this package work?

No. Projects nowadays should be looking to move away from the legacy CommonJS module system. If you use TypeScript or another transpilation tool, you may be able to convert your project to ESModules and interoperate with CommonJS packages (in TypeScript there is the `esModuleInterop` flag you can set to true).

2. My project uses ESModule syntax, but compiles to CommonJS in post, will this package work?

If the resulting code is CommonJS this package will not be compatible.

3. Do you plan to support CommonJS?

No, sorry. 😔

4. Will this work with my JS-only project?

No need to worry, it will work just fine with JS! You still get all of the types out of the box even with JS, but you won't be able to take full advantage of the amazing benefits of types.

5. Do I need to log in to my FakeYou account to use this package?

It's totally optional. You can still request TTS, but you will be missing out on any premium benefits and linking your TTS history to your account.

6. What versions of Node.js do you support?

I have not tested anything above Node.JS LTS (v18 as of writing).

7. Does it work in the browser?

No, unfortunately. 😔 It is best you create your own web server that uses this package to build your app.
