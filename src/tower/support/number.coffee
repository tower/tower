Tower.Support.Number =    
  isInt: (n) ->
    n == +n && n == (n|0)
  
  isFloat: (n) ->
    n == +n && n != (n|0)

module.exports = Tower.Support.Number
