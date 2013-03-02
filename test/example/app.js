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

/**
 * Standard JavaScript extension:
 * We want to allow for pre-processing.
 * The first parameter is the new extension you want to watch for. This will trigger the callback and
 * perform the wanted actions. In this case, we only need to return the same file as we aren't touching
 * it. If you were to have  a coffee-script extension, for example, you would compile the file
 * and return the contents within the `data` key and you would return the filename with a coffee extension
 */
bundler.extend(function() {
  this.createExtension('js', function (filename, package) {
    return {
      filename: filename + 'js',
      data: null
    };
  });
});

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
