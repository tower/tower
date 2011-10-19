class Less
  engine: -> require('less')
  
  # compile "./application.less"
  compile: (content) ->
    #options ?= {}
    #options.bare = true if options.bare == undefined
    result = null
    @engine().render content, (error, data) -> result = data
    result
    
exports = module.exports = Less
