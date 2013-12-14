# Tower.js

[http://tower.github.io](http://tower.github.io)

Small components for building apps, manipulating data, and managing a distributed application.

Tower represents a different way to build applications. We present a non-monolithic, distribution of modules that can be used in together, to form Tower, or separately in a normal Node.js program. This ensures that Tower isn't a lock in, and provides extremely coordinated modules.

Currently, many applications are developed as a single unit. This makes it much harder to develop in teams and to manage the complexity. Thus, Tower provides you the tools to create fully modular applications in a manageable way. This includes tools for both the client-side and server-side. Tower uses the standard Node.js platform (NPM) on the server and component for the client-side.

**Note:** Tower is currently under active development and isn't fully ready for use. Please be aware of this before opening any issues.

Tower is very low level now. It has minimal dependencies. It doesn't depend on jQuery, underscore, mongodb, or any such "limiting" factor. It's all JavaScript. Each micro component is around 1kb, so if you wanted to make things super lean, you can just grab the bare bones you need.

If there's anything in particular you're wondering about, create a new issue. The IRC is no longer used much.

The source for the guides on the site are here: https://github.com/tower/guides. They're very much a work in progress.

## Installation

node.js:

```bash
$ npm install tower -g # You may need to prepend with `sudo`
```

browser:

```bash
$ component install tower/tower
```

This is installed through [component](https://github.com/component/component).

## Example

This main module is just a collection of tiny components to make it easy to get going. See the [individual repositories](https://github.com/tower) for details on how to use each one. Enjoy!

```js
var tower = require('tower');

tower.resource;
tower.query;
tower.adapter;
tower.router;
tower.route;
tower.validator;
tower.type;
tower.memory;
```

All of those modules are available on both the client and the server.

If you're on the client, you also have template rendering components (they're just about ready for the server too):

```js
tower.template;
tower.content;
tower.directive;
```

## Tower Cli

```bash
$ tower <verb> <object> [options]
```

### Examples

```bash
$ tower create recipe my-recipe
$ tower start mongodb
$ tower stop mongodb
$ tower enter mongodb
$ tower start
$ tower stop
```

## License

MIT.
