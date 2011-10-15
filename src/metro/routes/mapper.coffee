class Mapper extends Class
  constructor: (collection) ->
    @collection = collection
  
  match: ->
    path    = arguments[0]
    options = arguments[arguments.length - 1]
    @collection.add(path, options)

exports = module.exports = Mapper
