# Defines how to parse a specific URL query parameter into a database criteria.
# 
# 
class Tower.Net.Param
  @perPage:       20
  @sortDirection: 'ASC'
  @sortKey:       'sort'                 # or 'order', etc.
  @limitKey:      'limit'                # or 'perPage', etc.
  @pageKey:       'page'
  @separator:     '-'                    # or '-'

  @create: (key, options = {}) ->
    options = type: options if typeof options == 'string'
    options.type ||= 'String'
    new Tower.Net.Param[options.type](key, options)

  constructor: (key, options = {}) ->
    @controller = options.controller
    @key        = key
    @attribute  = options.as || @key
    @modelName  = options.modelName
    @namespace  = _.pluralize(@modelName) if modelName?
    @exact      = options.exact || false
    @default    = options.default

  parse: (value) -> 
    value

  render: (value) -> 
    value

  toCursor: (value) ->
    nodes     = @parse(value)
    criteria  = Tower.Model.Cursor.create()
    criteria.make()

    for set in nodes
      for node in set
        attribute   = node.attribute
        operator    = node.operators[0]
        conditions  = {}
        if operator == '$eq'
          conditions[attribute] = node.value
        else
          conditions[attribute] = {}
          conditions[attribute][operator] = node.value

        criteria.where(conditions)

    criteria

  parseValue: (value, operators) ->
    namespace: @namespace, key: @key, operators: operators, value: value, attribute: @attribute

  _clean: (string) ->
    string.replace(/^-/, '').replace(/^\+-/, '').replace(/^'|'$/, '').replace('+', ' ').replace(/^\^/, '').replace(/\$$/, '').replace(/^\s+|\s+$/, '')

require './param/array'
require './param/date'
require './param/number'
require './param/order'
require './param/string'

module.exports = Tower.Net.Param
