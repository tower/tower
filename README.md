# Tower.js <img src="http://cloud.github.com/downloads/viatropos/tower/tower.png"/>

### Version 0.5.0 - In Development

> Full Stack Web Framework for Node.js and the Browser.

Built on top of Node’s Connect, Express, and Ember.js. Built for the client *and* server, from the ground up.

[![Build Status](https://secure.travis-ci.org/viatropos/tower.png)](http://travis-ci.org/viatropos/tower)

Follow me [@viatropos](http://twitter.com/viatropos).

- **IRC**: #towerjs on irc.freenode.net
- **Issues**: https://github.com/viatropos/tower/issues
- **Ask a question**: http://stackoverflow.com/questions/tagged/towerjs
- **Roadmap**: https://github.com/viatropos/tower/blob/master/ROADMAP.md
- **Latest Docs**: https://github.com/viatropos/tower/wiki

This is the 0.5.0 branch, which is under heavy development. **It's not ready!!**

## Default Development Stack

- Ember.js
- jQuery
- Handlebars (templating)
- Stylus, LESS (You can include either package)
- MongoDB (database, it’s optional. Tower can just be used in the browser)
- Redis (background jobs, also optional)
- Mocha (tests)
- JavaScript Default (You can include the coffee-script package)
- 
Includes a database-agnostic ORM with browser (memory and AJAX), and MongoDB support.  Tower is modeled after ActiveRecord and Mongoid for Ruby. Includes a controller architecture that works the same for both client and server, modeled after Rails.  The routing API is like that of Rails 3.  Templates also work on client and server—and you can swap in any template engine, no problem.  Includes asset pipeline that works just like Rails 3 (minifies and gzips assets with an md5-hashed name for optimal browser caching, if you desire).  And it includes a watcher that automatically injects javascripts and stylesheets into the browser *as you develop*.

It solves a lot of our problems. We hope it solves yours, too.

## Install

```
npm install tower -g
```


Finally, make sure you have `mongodb` installed and running:

```
brew install mongodb
mongod # starts server
```

If you would like to try out the background-worker code, you can also install and start `redis`:

```
brew install redis
redis-server
```

## Generate

In your terminal, generate your app and start your server:

```
tower new app
cd app
npm install
tower generate scaffold Post title:string body:text
tower generate scaffold User firstName:string lastName:string email:string
node server
```


You don't need to restart the server when you run `tower generate` commands. The new bundler will automatically detect new files added.

If you run into an error during `npm install`, remove the `node_modules` folder and try again.

Tower includes a fail-safe system. If any errors are triggered, the process will display the error, and wait for a file change.
The same error message will also be displayed to the browser. 


## Views

Views are all Ember.

## Templates

Templates adhere to the [Twitter Bootstrap 2.x](http://twitter.github.com/bootstrap/) markup conventions.

## Styles

You have the choice in what style framework you want (Twitter Bootstrap, Zen, etc..). Just find the tower package and install it.
A drop in system. Do we not support a specific style framework? Build your own package and get it registered into towerjs.org.

All assets (client-side) are read from `/public`, which is the compiled output of everything in `/app`, `/lib`, `/vendor` (and wherever else you might put things).  The default is to use Stylus for CSS in `/app/assets/stylesheets`.


## Contributing to Tower

```
git clone https://github.com/viatropos/tower.git
cd tower
node index.js install
```

### Building Tower

Or, you can have it recompile files whenever you change them:

```
make watch
```

### “Linking” Tower

You can symlink your local tower repository to your global npm `node_modules` directory, which allows you use it in your apps. That way, if you make changes to the tower repository, you’ll see them in your app! Very useful.

In the tower repo:

```
npm link
```

In a tower app:

```
npm link tower
```

If you want to try installing tower from the remote npm registry, you can just unlink it and run `npm install`:

```
npm unlink tower
npm install tower
```

Using `npm link` makes it very easy to mess with the source.

### Running Tests

In the tower repo, run server tests with:

```
make test-server
```

To run client tests, first compile the test app and start its server:

```
make build-test-client
make start-test-client
```

Then run the tests (uses phantomjs)

```
make test-client
```

If you don’t have `phantomjs`, you can install it with:

```
brew install phantomjs
```

## License

(The MIT License)

Copyright &copy; 2012 [Lance Pollard](http://twitter.com/viatropos) &lt;lancejpollard@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
