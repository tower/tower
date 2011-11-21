Metro.Support.Number =    
  isInt: (n) -> 
    # typeof(n) == 'number' && n % 1 == 0
    n == +n && n == (n|0)
  
  isFloat: (n) ->
    # typeof(n) == 'number' && n % 1 != 0
    n == +n && n != (n|0)

module.exports = Metro.Support.Number
