# Contributing to fakeyou.ts

Thanks for considering contributing to this project! 😄

## Setup local copy of fakeyou.ts

1. Fork and clone this repository on the `main` branch so you can test changes without affecting this repository.
2. Run `npm install` to install all dependencies.
3. Run `npm link`, so you can symlink this project into the node_modules of another project later to test your changes.

**If you use Visual Studio Code, you may get a popup asking if you would like to install recommended extensions. As is suggested, I would recommend you do!**

If you dismissed the popup, you can see the extensions in `.vscode/extensions.json`.

## Setting up a test project

Of course you need to be able to test your changes!

1. Create a new directory somewhere else on your computer to hold the test project. Call it something like `fakeyou.ts-test`.
2. Run `npm init -y` to create a new package.json.
3. Enable ESModule support with `npm pkg set type=module`.
4. Run `npm link fakeyou.ts` to create a node_modules symlink to your local fakeyou.ts.
5. Create a new `index.js` file (or any other file) and write your test code.
6. `node index.js` to test your changes!

## What about TypeScript?

1. Rename your `.js` files to `.ts`.
2. Replace use of `node` with `npx tsx`. Tsx is a high-performance way to run TypeScript code directly with zero configuration. _It does not relate to React JSX, if that is what you are thinking._
3. Tsx will consider your `tsconfig.json` if you have one. Just make sure to never set `compilerOptions.module` to `CommonJS`!

## Testing

This project explicitly separates unit tests and e2e tests so unit tests can be run locally, quickly and e2e tests can run separately less frequently.

_For this project there isn't much that integration testing could take away from an e2e test to simplify the testing experience. It was considered!_

### Run unit tests

```sh
npm run test:unit
```

### Run e2e tests

Some e2e tests (tests that require authentication to complete) will require a session cookie.
You will need to find your session cookie and put it in the `.env` file at the root of this project.

Do keep in mind that using a session cookie will add test data to a FakeYou account (like sample TTS inferences). By the very nature of e2e test, it will test the whole process as if a user was using the package to make sure nothing errors along the way. It might be best to create a new FakeYou account.

```sh
npm run test:e2e
```

### Run a specific test suite

```sh
npm run test -- FileName # Case sensitive, can use partial match
```

This project uses Vitest. Check it out [here](https://vitest.dev/) to learn more! It was made for unit testing, but fakeyou.ts does not demand much from an e2e test so this package will stick with it.

## Other things of note

This project uses Husky to run pre-commit and pre-push commands to ensure that all tests pass, there are no typing issues, and that the code is formatted properly.

Extending the above, Eslint with Prettier is used for linting and formatting. Absolutely zero Eslint violations will be accepted (even warnings), and any ignores will be considered on a case-by-case basis!

Usage of the `any` type is strictly forbidden (there is an eslint rule for this, but it should never be eslint-ignored).

Commit messages are linted and must follow a strict format which includes a GitHub issue number. You can read more about the format of the commit message [here](https://www.conventionalcommits.org/en/v1.0.0/).

For example, if I add a new feature, and the issue number on GitHub is #1 then this would be how I write my commit:

```sh
git commit -m "feat(#1): added a new feature!"
```

## When you're ready...

Create a PR of your fork! 😄
Again, thanks for the help keeping fakeyou.ts alive.
