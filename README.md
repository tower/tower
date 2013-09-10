# Tower.js

Small components for building apps, manipulating data, and managing a distributed infrastructure.

Tower is very low level now. It has minimal dependencies. It doesn't depend on jQuery, underscore, mongodb, or any such "limiting" factor. It's all JavaScript. Each micro component is around 1kb, so if you wanted to make things super lean, you can just grab the bare bones you need.

Some things that were in 0.4.0 aren't there yet in 0.5.0, in particular relations. However, the new way you build modules makes writing these things much easier. This time around solid API principles are in place. Everything must be fast (performance), small (file size), and simple, so it requires minimal mental energy to dig into the code. Needless to say, this is still super alpha software.

If there's anything in particular you're wondering about, join in the #towerjs IRC.

The source for the guides on the site are here: https://github.com/tower/guides. They're very much a work in progress.

## Installation

node.js:

```bash
$ npm install tower
```

to get the cli:

```bash
$ npm install tower-cli -g
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
$ tower install recipe my-recipe
$ tower start mongodb
$ tower stop mongodb
$ tower enter mongodb
$ tower start
$ tower stop
```

## License

MIT.