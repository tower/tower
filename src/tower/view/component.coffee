class Tower.View.Component
  @render: ->
    args              = _.args(arguments)
    template          = args.shift()
    block             = _.extractBlock(args)
    unless args[args.length - 1] instanceof Tower.Model || typeof(args[args.length - 1]) != "object"
      options         = args.pop()
    options         ||= {}
    options.template  = template
    (new @(args, options)).render(block)

  constructor: (args, options) ->
    @[key] = value for key, value of options

  tag: (key, args...) ->
    @template.tag key, args

  addClass: (string, args) ->
    result = if string then string.split(/\s+/g) else []
    for arg in args
      continue unless arg
      result.push(arg) unless result.indexOf(arg) > -1
    result.join(" ")