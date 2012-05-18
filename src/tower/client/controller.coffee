require './controller/elements'
require './controller/events'
require './controller/handlers'

Tower.Controller.reopenClass extended: ->
  object    = {}
  name      = @className()
  camelName = _.camelize(name, true)

  object[camelName] = Ember.computed(->
    Tower.Application.instance()[name].create()
  ).cacheable()

  Tower.Application.instance().reopen(object)

  @

  instance: ->
    Tower.Application.instance().get(camelName)

Tower.Controller.include Tower.Controller.Elements
Tower.Controller.include Tower.Controller.Events
Tower.Controller.include Tower.Controller.Handlers

$.fn.serializeParams = (coerce) ->
  $.serializeParams($(this).serialize(), coerce)

$.serializeParams = (params, coerce) ->
  obj = {}
  coerce_types =
    true: not 0
    false: not 1
    null: null

  array = params.replace(/\+/g, " ").split("&")

  for item, index in array
    param = item.split("=")
    key = decodeURIComponent(param[0])
    val = undefined
    cur = obj
    i = 0
    keys = key.split("][")
    keys_last = keys.length - 1
    if /\[/.test(keys[0]) and /\]$/.test(keys[keys_last])
      keys[keys_last] = keys[keys_last].replace(/\]$/, "")
      keys = keys.shift().split("[").concat(keys)
      keys_last = keys.length - 1
    else
      keys_last = 0
    if param.length is 2
      val = decodeURIComponent(param[1])
      val = (if val and not isNaN(val) then +val else (if val is "undefined" then `undefined` else (if coerce_types[val] isnt `undefined` then coerce_types[val] else val)))  if coerce
      if keys_last
        while i <= keys_last
          key = (if keys[i] is "" then cur.length else keys[i])
          cur = cur[key] = (if i < keys_last then cur[key] or (if keys[i + 1] and isNaN(keys[i + 1]) then {} else []) else val)
          i++
      else
        if $.isArray(obj[key])
          obj[key].push val
        else if obj[key] isnt `undefined`
          obj[key] = [ obj[key], val ]
        else
          obj[key] = val
    else obj[key] = (if coerce then `undefined` else "")  if key

  obj
