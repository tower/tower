var app = Tower.create()
  , model = app.model
  , view = app.view
  , controller = app.controller
  , route = app.route
  , service = app.service
  , store = app.store
  , bundle = app.bundle;

route('index', { path: '/' });
route('users.index', { path: '/users' });
route('users.show', { path: '/users/:id' });

route('index')
  .setup(function() {
    this.controller('users').all();
  })
  .render('json');

model('user')
  .field('email')
    .validates('format', 'email')
  .field('firstName')
  .timestamps();

bundle(function() {
  this.js('compiler', 'loose');
  this.css('compiler', 'bundled');
});