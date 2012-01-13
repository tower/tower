class Tower.Generator.Attribute
  constructor: (name, type = "string") ->
    @name = name
    @type = type

  fieldType: ->
    @fieldType ||= switch @type
      when "integer"                then "numberField"
      when "float", "decimal"       then "textField"
      when "time"                   then "timeSelect"
      when "datetime", "timestamp"  then "datetimeSelect"
      when "date"                   then "dateSelect"
      when "text"                   then "textArea"
      when "boolean"                then "checkBox"
      else
        "textField"
    
  default: ->
    @default ||= switch @type
      when "integer"                        then 1
      when "float"                          then 1.5
      when "decimal"                        then "9.99"
      when "datetime", "timestamp", "time"  then Time.now.toString("db")
      when "date"                           then Date.today.toString("db")
      when "string"                         then (if name == "type" then "" else "MyString")
      when "text"                           then "MyText"
      when "boolean"                        then false
      when "references", "belongsTo"        then null
      else
        ""

  humanName: ->
    @name.humanize()

  isReference: ->
    @type.in(["references", "belongsTo"])

module.exports = Tower.Generator.Attribute
