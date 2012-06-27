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

### Locally (in generated app)

```
tower new my-app
cd my-app
npm install git://github.com/nodejitsu/forever#node-0.8 # install this first
npm install
```

If you have an existing app, uninstall tower and reinstall

```
npm uninstall tower design.io forever
npm install git://github.com/nodejitsu/forever#node-0.8
npm install design.io forever tower
```

### Playing around with the Tower source code

Specifically the **dev branch** (excited)!

```
git clone https://github.com/viatropos/tower.git # or your fork
cd tower
git checkout -b development origin/development
npm install git://github.com/nodejitsu/forever#node-0.8
npm install
npm link # makes it global so you can play around with it in any number of generated apps
```

Then generate an app and link it:

```
tower new my-app
cd my-app
npm link tower # now it's using the development branch of the cloned repo
```

If you change branches or change anything in your cloned tower repo, that exact same code will be used in your generated app (thanks to the symlink).

### Deploying to Heroku

Specify node and npm version: https://devcenter.heroku.com/articles/nodejs-versions/.

Also, if you need to execute an NPM in a `postinstall` hook in package.json, you'll get `sh: npm not found` on Heroku. So, add `"npm": ">= 1.1.1"` to your package.json.

Another random note. Tower has coffee-script and coffeecup modules installed in a `postinstall` script defined in package.json. If you add coffee-script to your app's package.json (pointing to the same custom coffee-script fork), it will install it twice and there's a weird error having something to do with `chmod` and permissions on `..../bin/coffee`, _on heroku only_, probably because it's trying to remove the `coffee` command from within coffeecup - since it's installing `coffee-script` again. Just add the regular `coffee-script` dependency in your package.json if you get this error.

So do this:

``` json
{
  "name": "your-app",
  "engines": {
    "node": "0.8.0",
    "npm": ">= 1.1.1"
  },
  "dependencies": {
    "coffee-script": ">= 1.3.2",
    "tower": "git://github.com/viatropos/tower.git#development",
    "npm": ">= 1.1.1"
  }
}
```

not this:

``` json
{
  "name": "your-app",
  "engines": {
    "node": "0.8.0",
    "npm": ">= 1.1.1"
  },
  "dependencies": {
    "coffee-script": "git://github.com/viatropos/coffee-script.git",
    "tower": "git://github.com/viatropos/tower.git#development",
    "npm": ">= 1.1.1"
  }
}
```