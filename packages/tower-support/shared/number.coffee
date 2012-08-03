Tower.NumberHelper =
  isInt: (n) ->
    n == +n && n == (n|0)

  isFloat: (n) ->
    n == +n && n != (n|0)

  randomSortOrder: ->
    Math.round(Math.random())-0.5

  randomIntBetween: (min, max) ->
    min + Math.floor(Math.random() * ((max - min) + 1))

module.exports = Tower.NumberHelper
