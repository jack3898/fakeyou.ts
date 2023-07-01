# FakeYou.ts

A modern, light and easy-to-use API wrapper for FakeYou. Get your app up and running with FakeYou in minutes!

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

### Why this over fakeyou.js?

First thing I should clear up is I did not develop fakeyou.js! It's a separate library by a separate author.

I found that it was buggy and its lack of type-safety made it harder to use. It also hasn't been maintained in a while, relies on functionality in third-party packages that node can do out of the box and I did try to fork it and convert it to TypeScript but in the end it just seemed like a good idea to just write my own library!

That being said, fakeyou.js does have more features as of writing, so if there is something you need that this library does not yet have feel free to use fakeyou.js and/or raise an issue and I will add it to my backlog!
