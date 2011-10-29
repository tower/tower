# https://github.com/timrwood/moment
# http://momentjs.com/docs/
class Time
  @_lib: ->
    require 'moment'
  
  @zone: ->
    #Metro.Support.Time.TimeWithZone
    @
  
  @now: ->
    new @()
    
  constructor: ->
    @moment = @constructor._lib()()
    
  toString: ->
    @_date.toString()
    
  beginningOfWeek: ->
    
  week: ->
    parseInt(@moment.format("w"))
    
  dayOfWeek: ->
    @moment.day()
    
  dayOfMonth: ->
    parseInt(@moment.format("D"))
  
  dayOfYear: ->
    parseInt(@moment.format("DDD"))
    
  meridiem: ->
    @moment.format("a")
    
  zoneName: ->
    @moment.format("z")
    
  strftime: (format) ->
    @moment.format(format)
  
  beginningOfDay: ->
    @moment.seconds(0)
    @
    
  beginningOfWeek: ->
    @moment.seconds(0)
    @moment.subtract('days', 6 - @dayOfWeek())
    @
  
  beginningOfMonth: ->
    @moment.seconds(0)
    @moment.subtract('days', 6 - @dayOfMonth())
    @
    
  beginningOfYear: ->
    @moment.seconds(0)
    @moment.subtract('days', 6 - @dayOfMonth())
    
  toDate: ->
    @moment._d

class Time.TimeWithZone extends Time
  
  
module.exports = Time
