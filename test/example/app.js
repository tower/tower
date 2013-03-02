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

bundler.config(function() {
  this
    .js()
      .compiler('type', 'loose')
      .path('public/javascript')
    .css()
      .compiler('type', 'loose')
      .path('public/styles');
});


app.initialize();
