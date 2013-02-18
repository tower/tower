var app = Tower.create()
  , model = app.model
  , view = app.view
  , controller = app.controller
  , route = app.route
  , service = app.service
  , store = app.store
  , bundler = app.bundler;

route('index', { path: '/' });
route('users.index', { path: '/users' });
route('users.show', { path: '/users/:id' });

route('index')
  .setup(function() {
    this.controller('users').all();
  })
  .render('json');

// Retrieve the cassandra adapter;
/**model.adapter('cassandra').config({
  host: '127.0.0.1',
  port: 9160
});
**/
// XXX: Getting a cassandra API working:
// A model here would be translated to a keyspace in cassandra terms.
// Cassandra uses a key -> value storing model.
//
// KEY: | VALUE                    |
// -----|--------------------------|
// ID2  | COLUMN1 | COLUMN2 | COLUMN3
//
// XXX: Decide if were going with CQL3 (SQL-like query language) or
//      use the Thrift driver. CQL3 seems much more powerful, but we'll
//      see.
//
// Cassandra also supports Hadoop and MapReduce. If we need to batch
// process all our data from within cassandra we can send it off to
// hadoop. Things like prediction algorithms, machine-learning, etc...
//
// We should have some controls in the admin backend to start and stop
// batch jobs from hadoop. We could possibly use Hive or Pig instead of
// traditional Hadoop. Hadoop and Cassandra will be using S3 (network)
// instead of the rack-aware HFST (w/e it's called - hadoop file system)?
// Hive is used for big-data analysis
/**
model('users')
  // Select a keyspace to use:
  .use('exampleKeySpace')
  // This returns a child class of the generic Model adapter.
  // By specifying `cassandra` and that the specified adapter is
  // loaded, you're now using a new data store within Tower.
  // Cassandra will have specific methods and APIs.
  .type('cassandra')
//
.field('name', 'UTF8Type')
// or we could alias the field method to use a more appropriate
// term for Cassandra.
// i.e column family, family, etc...
.field('username', 'UTF8Type')
// Typically you wouldn't have any validators on the data as
// it's fairly dynamic.
**/

bundler.config(function() {
  this.js('compiler', 'loose');
  this.css('compiler', 'bundled');
});