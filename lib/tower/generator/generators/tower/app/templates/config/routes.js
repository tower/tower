
Tower.Route.draw(function() {
  return this.match("(/*path)", {
    to: "application#index"
  });
});
