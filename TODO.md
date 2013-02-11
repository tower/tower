# TODO


* Add express.js
* Finish proxy server
* Create a configuration system (already started)
* Create an autoloading class
* Create an extension on the container class. Ability to use Ember's lookup
  functionality.
* Create a testing environment.
	* Global tests (Acceptance testing)
	* Package tests
* Finish the bundler
	* Implement the new watcher API
	* Implement a new asset system
	* Implement Resolve.js (with hybrid approach)
	* Create building process
	* Create handlebars helpers to work with the bundler
* Implement a `Quick Load` system. Reloading the client app when a file changes
  but saving the state then restoring it upon refresh.
* Implement Handlebars
* Implement a wrapper around Ember.View 
	* Because we'll need to implement our own `{{outlet}}` functionality
	* We'll need to link the Controllers, Views and Models together.
* Try split rendering. 
	* Make some benchmarks
* Merge the new router, models, etc.. into Tower
