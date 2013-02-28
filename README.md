# Tower
---

| Version | 0.5.0 | 
| ------ |:---:|
| Stable? | Yes |
| Next Release | 0.5.3 |


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


| Model Adapters |  
| -------- |
| MongoDB |
| Cassandra |
| Hadoop (MapReduce) |
| HBase |
| Redis |
| MySQL |



**What's Tower?**

Tower is a decentralized, full stack, node.js/browser framework. 

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
