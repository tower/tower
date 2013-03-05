[<img src="https://raw.github.com/TheHydroImpulse/tower/master/tower.png">](http://towerjs.org/)

<div style="text-align: center">
<a href="http://travis-ci.org/viatropos/tower"><img src="https://secure.travis-ci.org/viatropos/tower.png" alt="Build Status"/></a>
</div>

| Version | 0.5.0 |
| ------ |:---:|
| Stable | 0.5.0 |

**What's Tower?**

Tower is a decentralized, full stack, node.js/browser framework built around convention over configuration. Tower works best within a distributed infrastructure, but don't let that scare you, a single server is still cool.

> Sounds cool and all, but why would I use it?

Tower solves many problems. These solved problems allow you to concentrate on your application logic and less on the platform or framework.

The point is simple: Building large applications is difficult. That's why large companies build many small applications and services that forms a decentralized infrastructure. Many of these systems are built from scratch and require an extraordinary amount of time to build and design.

Tower's goal is to decentralize your applications with ease, but with an exception. You build your application together, in one simple step, then you tell Tower how you want it decentralized.

**Want Hadoop MapReduce jobs for your BigData set?**
No Worries! These systems are built right into Tower. You can create standard jobs using hadoop. The rest is telling Tower about your infrastructure, that's it!

**Note:** Are you in favor of Pig or Hive for abstracting Hadoop? No worries. You can offload the processing to other languages that are more suited for these tasks.

Here is a rundown of the top Tower features (there's more, though):

| Features | Platform |
| -------- | -------- |
| Decentralized |
| Shared Code |
| Abstracted Ember.js | Client |
| Hot Code Push | Both |
| Kick-ass Routing System |
| Built-in Cluster |
| Process Load Balancing |
| Bundler |
| Package System |
| Model Adapters |
| Hadoop MapReduce Integration |
| Jobs |
| Redis (Sessions, State, etc..) |
| Lazy Evaluation | Client |
| Testing 2.0 | Both |
| REPL |
| Generators |
| Scaffolding |
| Single File Apps (Custom Directory Structures) |
| Real-time |
| Modular |

Models are a huge part within Tower. You should be able to manage your data in a **standardized** way, regardless of the database you use. We have built a group of built-in model adapters that work together using a standardized API. This allows you to easily work with multiple different data sources in a non ad-hoc way.

| Model Adapters |
| -------- |
| MongoDB |
| Cassandra |
| Hadoop (MapReduce) |
| HBase |
| Redis |
| MySQL |


**Node.js/Browser:** With the rise of client-side frameworks, people are required to double their work. Duplicating models, controllers and views. This is anything but DRY.

Tower leverages Node.js and JavaScript so that you write code a single time, for both platforms. Of course the platforms require different logic at times.

**Decentralized:** Tower's core was re-built to support large server infrastructures across clusters, load balancers, and servers. You can load Tower through git and update each server with a single code repository. Tower was designed with this in mind.

Do you run a different server setup/configuration for your API servers vs your application ones? No problem. You can use the built-in Tower package `divide` which allows you to control routes to particular servers. This is called being master. A server, or set of servers can be masters of particular routes. That way, you start to decentralize your application.

**Node.js Single Thread Issue:** Node.js runs in a single thread (for simplicity sake) and doesn't allow multithreading due to the V8 engine. Tower has a built-in cluster module. Because Tower automatically runs behind a proxy server, the actual framework is run in a child process. Each child process is stateless and offloads the storing of state to a different mechanism. This allows you to spawn as many processes as you need on a single server.

Think of a server as another load balancer to many many processes running on that server.

----

Tower changes how you think of MVC. It has Models, Views (and Templates) and Controllers, but they are being redefined.

**Models:** Models are APIs you use to define your model, that's it! `model('users')`. You don't use a model to access the data, that's left for the controllers.

**Controllers:** Controllers are what models used to be. You use controllers to control your data and how you want to access it. `controller('users').find({ username: 'Hello_World' });`.

**Views:** Views are the same as on the client-side. Both the client and server-side uses Handlebars.

**Templates:** These are where the Handlebar templates are contained. All your HTML and presentation data.

**Routes:** Routes are what controllers used to be, but they are more than that. You define routes `route('index')` and you can attach various methods to that route. This is where you'd typically have controllers.

----

## Installation

To install Tower follow these steps:

1. `npm install tower -g` (use sudo if you're on OS X or Linux)
2. Done.

If you want MongoDB or other databases then make sure those are installed:

* MongoDB: `brew install mongo`
* HBase: `brew install hbase`
* Hadoop: `brew install hadoop`
* Cassandra: `brew install cassandra`
* Redis: `brew install redis`

## Generating Applications

If you want to generate an application make sure you have Tower installed.

1. `tower new ExampleApplication`
2. `cd ExampleApplication && npm install`


## Running Tower

Make sure you're within the application's folder:

`tower server` or `tower`

Don't try and run Tower with node's binary.

## Single File Applications

For really quick you can basically write the entire app in a single file (excluding templates, and assets, of course).

You can use one of the generators to get started exceptionally quickly:

1. `tower new SingleFileApp --generator=singlefile`
2. `cd SingleFileApp && npm install`
3. `tower server`

That's it. If you want to change the directory structure, then edit the `package.js` file.


## Packages

In Tower, everything's a package, even your application. This makes things standardized and simple. Want to create a new package? ….



