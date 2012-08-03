# @todo This is just an idea
for filter in ["stylus", "less", "markdown"]
  @[filter] = (text) ->
    Tower.View.render(text, filter: filter)