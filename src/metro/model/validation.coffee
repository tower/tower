class Validation
  constructor: (name) ->
    @name       = name
    @attributes = Array.prototype.slice.call(arguments, 1, arguments.length)
  
  validate: (record) ->
    success = true
    
    for attribute in @attributes
      value = record[attribute]
      success = !!value?
      unless success
        record.errors().push
          attribute: attribute
          message: "#{attribute} can't be blank"
        return false
      
    true

module.exports = Validation
