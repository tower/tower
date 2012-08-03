Tower.js
========

Thanks for installing Tower and using it to build an application!
You can read this file for more information on how to get started.
You can also read the website we've made: http://towerjs.org.
There are also plenty of screencasts here: http://towerjs.org/screencast.

Install
-------

You've probably already got `tower.js` installed if you're reading this, but just in case we've provided a little instruction.
To get started with `tower.js` you'll need the following software:

  * Node.js
  * Node Package Manager (aka, npm)

With those two installed you only need to do the following steps to create your first app:

  1. `npm install -g design.io forever tower`
  2. `tower new app_name_here`
  3. `cd app_name_here`
  4. `npm install`

Now your application is fully setup and ready to run with `forever`:

    $ forever server.js

You an discover the other commands by using `tower generate`.
You also have access to a console with `tower console`.
Look to the `cake` file for more commands.


Test
----

Run tests:

```
npm test
```

Read up on [testing Tower.js apps](http://towerjs.org/guides/testing).

## Deploy

[How to deploy Tower Apps to Heroku](http://towerjs.org/guides/deployment#heroku).

## Documentation

- [Tower.js](http://towerjs.org/guides)
- [MongoDB](http://www.mongodb.org/display/DOCS/Advanced+Queries)
- [Node.js](http://nodejs.org/docs/v0.6.11/api/fs.html)
- [Mocha](https://github.com/visionmedia/mocha)
- [CoffeeScript](http://coffeescript.org/)
- [Stylus](http://learnboost.github.com/stylus/)

If all else fails, see the [Rails Guides](http://guides.rubyonrails.org/), should be fairly close.

