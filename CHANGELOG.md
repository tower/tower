- for developing tower src (`development` branch), make sure to install the branches of coffee-script and coffeecup we're working with:
  1. turn off design.io
  2. `npm install`
  3. `npm install git://github.com/viatropos/coffeecup.git`
  4. `npm install git://github.com/viatropos/coffee-script.git`
  5. `npm install git://github.com/viatropos/neo4js.git`
  5. `design.io watch`
  6. `npm test`

## Node 0.8.0 Setup

### Globally

```
brew upgrade node
node -v # should be >= 0.8.0
curl http://npmjs.org/install.sh | sh
npm -v # should be >= 1.1.32
npm uninstall design.io forever tower daemon -g
npm cache clean -g
npm install daemon -g
npm install git://github.com/nodejitsu/forever#node-0.8 -g
npm install design.io -g
npm install tower -g
```

### Locally (in cloned tower repo)

If you haven't already cloned the tower repo:

```
npm install git://github.com/nodejitsu/forever#node-0.8
npm install design.io
```

Otherwise:

```
npm uninstall design.io forever hook.io
npm install git://github.com/nodejitsu/forever#node-0.8
npm install design.io
```