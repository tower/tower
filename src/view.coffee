class View
  @bootstrap: ->
    @
    
  constructor: (name, options) ->
    @path = name
    
  render: (options, callback) ->
    @template.render(@read(), options, callback)
    
  read: ->
    fs.readFileSync(@path, "utf-8")
  
exports = module.exports = View
