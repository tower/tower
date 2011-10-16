class Base
  @load_paths: []
  
  constructor: (name, options) ->
    @path = name
    
  render: (options, callback) ->
    @template.render(@read(), options, callback)
    
  read: ->
    fs.readFileSync(@path, "utf-8")
  
module.exports = Base
