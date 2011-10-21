class Less
  engine: -> require('less')
  
  # need to specify lookup paths for imports!
  # compile "background: red", paths: ["./app/assets/stylesheets"]
  compile: (content, options = {}) ->
    #options ?= {}
    #options.bare = true if options.bare == undefined
    result = null
    engine = @engine()
    parser = new engine.Parser(options)
    parser.parse content, (error, tree) -> result = tree.toCSS()
    result
    
exports = module.exports = Less
