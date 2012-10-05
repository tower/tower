Tower._.mixin
  isInt: (n) ->
    n == +n && n == (n|0)

  toInt: (object) ->
    switch _.kind(object)
      when 'date' then object.getTime()
      else
        parseInt(object)

  isFloat: (n) ->
    n == +n && n != (n|0)

  randomSortOrder: ->
    Math.round(Math.random())-0.5

  randomIntBetween: (min, max) ->
    min + Math.floor(Math.random() * ((max - min) + 1))
