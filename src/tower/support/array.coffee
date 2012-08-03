nativeIndexOf = Array.prototype.indexOf

Tower.ArrayHelper =
  toStringIndexOf: (array, item, isSorted) ->
    return -1 unless array?

    i = 0
    l = array.length

    while i < l
      return i if i of array && array[i] && item && array[i].toString() == item.toString()
      i++
    -1

  equals: (a, b) ->
    if a && typeof a.equals == 'function'
      a.equals(b)
    else
      _.isEqual(a, b)

  extractOptions: (args) ->
    if typeof args[args.length - 1] == "object" then args.pop() else {}

  extractBlock: (args) ->
    if typeof args[args.length - 1] == "function" then args.pop() else null

  args: (args, index = 0, withCallback = false, withOptions = false) ->
    args = Array.prototype.slice.call(args, index, args.length)

    if withCallback && !(args.length >= 2 && typeof(args[args.length - 1]) == "function")
      throw new Error("You must pass a callback to the render method")

    args

  # Sort objects by one or more attributes.
  #
  #     cityPrimer = (string) ->
  #       string.toLowerCase()
  #     sortObjects deals, ["city", ["price", "desc"]], city: cityPrimer
  #
  sortBy: (objects) ->
    sortings  = @args(arguments, 1)
    callbacks = if sortings[sortings.length - 1] instanceof Array then {} else sortings.pop()

    valueComparator = (x, y) ->
      if x > y then 1 else (if x < y then -1 else 0)

    arrayComparator = (a, b) ->
      x = []
      y = []

      sortings.forEach (sorting) ->
        attribute = sorting[0]
        direction = sorting[1]
        aValue    = a.get(attribute) # a[attribute]
        bValue    = b.get(attribute) # b[attribute]

        unless typeof callbacks[attribute] is "undefined"
          aValue  = callbacks[attribute](aValue)
          bValue  = callbacks[attribute](bValue)

        x.push(direction * valueComparator(aValue, bValue))
        y.push(direction * valueComparator(bValue, aValue))

      if x < y then -1 else 1

    sortings = sortings.map (sorting) ->
      sorting = [sorting, "asc"] unless _.isArray(sorting)

      if sorting[1].toLowerCase() == "desc"
        sorting[1] = -1
      else
        sorting[1] = 1

      sorting

    objects.sort (a, b) ->
      arrayComparator a, b