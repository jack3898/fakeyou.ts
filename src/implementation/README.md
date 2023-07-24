# Implementations

This package favours composition over inheritance so that we are not restricted by the structure of the code.

## How to use an implementation

You first create the class where you wish for the implementation to be derived from and use `implements` to make create a contract between you and a given interface to implement the properties and methods.

Then you set a property equal to the function exported from the same class your got the interface from.

For example, given an interface and implementation together in a module:

```ts
export interface User {
    username: string;

    fetchProfile: Promise<SomeUser>;
}

export function implFetchProfile(this: User): Promise<SomeUser> {
    return fetch(`https://someurl.com/${this.username}`);
}
```

You can then implement it on your class:

```ts
import {
    type User,
    implFetchProfile,
} from "../somedir/inplementation/index.js";

export default class ClassThatHasUserInfo implements User {
    constructor(client: Client, data: SessionUserSchema) {
        this.username = data.username;
    }

    readonly username: string;

    fetchProfile = implFetchUser;
}
```

And this will magically work, because `this` is automatically bound to the function.

You MUST remember to implement the interface on the class to ensure the function will work! TypeScript does not check the function will work for you, so the interface does that for us to make sure things won't go wrong.

## Why?

Using extends works a charm... until you need to extend with more than one class. Then things get messy, and a project refactor will be required.

With composition, as shown above, we can implement as many interfaces as we want. So long as the class meets the contract of the interface, we're good!

This formula for writing code is heavily inspired by Rust.

## Downsides

-   Private and protected methods are not supported in interfaces.
-   If an interface requires a property of a given name, you may need to alias it if you prefer a different name.
