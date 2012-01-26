class Tower.View.Component
  @render: ->
    args              = Tower.Support.Array.args(arguments)
    template          = args.shift()
    block             = Tower.Support.Array.extractBlock(args)
    options           = Tower.Support.Array.extractOptions(args)
    options.template  = template
    (new @(args, options)).render(block)
    
  constructor: (args, options) ->
    @[key] = value for key, value of options
    
  tag: (key, args...) ->
    @template.tag key, args