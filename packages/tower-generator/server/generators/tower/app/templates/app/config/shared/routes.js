Tower.Route.draw(function() {
  // this.match('(/*path)', {to: 'application#index'});
  this.match('/', {to: 'application#welcome'});
});
