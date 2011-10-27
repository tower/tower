class ArrayExtension
  @extract_args: (args) ->
    Array.prototype.slice.call(args, 0, args.length)
    
  @args_options_and_callback: ->
    args = Array.prototype.slice.call(arguments)
    last = args.length - 1
    if typeof args[last] == "function"
      callback = args[last]
      if args.length >= 3
        if typeof args[last - 1] == "object"
          options = args[last - 1]
          args = args[0..last - 2]
        else
          options = {}
          args = args[0..last - 1]
      else
        options = {}
    else if args.length >= 2 && typeof(args[last]) == "object"
      args      = args[0..last - 1]
      options   = args[last]
      callback  = null
    else
      options   = {}
      callback  = null
    
    [args, options, callback]
  
  # Sort objects by one or more attributes.
  # 
  #     cityPrimer = (string) ->
  #       string.toLowerCase()
  #     sortObjects deals, ["city", ["price", "desc"]], city: cityPrimer
  # 
  @sortBy: (objects) ->
    sortings  = Array.prototype.slice.call(arguments, 1, arguments.length)
    callbacks = if sortings[sortings.length - 1] instanceof Array then {} else sortings.pop()
    
    valueComparator = (x, y) ->
      if x > y then 1 else (if x < y then -1 else 0)
    
    arrayComparator = (a, b) ->
      x = []
      y = []
      
      sortings.forEach (sorting) ->
        attribute = sorting[0]
        direction = sorting[1]
        aValue    = a[attribute]
        bValue    = b[attribute]

        unless typeof callbacks[attribute] is "undefined"
          aValue  = callbacks[attribute](aValue)
          bValue  = callbacks[attribute](bValue)

        x.push(direction * valueComparator(aValue, bValue))
        y.push(direction * valueComparator(bValue, aValue))

      if x < y then -1 else 1
    
    sortings = sortings.map (sorting) ->
      sorting = [sorting, "asc"] unless sorting instanceof Array
      if sorting[1] is "desc"
        sorting[1] = -1
      else
        sorting[1] = 1
      sorting

    objects.sort (a, b) ->
      arrayComparator a, b
  
module.exports = ArrayExtension
