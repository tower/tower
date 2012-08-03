# Helpers to warp the time for testing: https://github.com/harvesthq/time-warp
# @todo And some time zone helpers
Tower.SupportDate =
  timeOffset: 0
  timeZone:   'UTC'

  withTimeZone: (block) ->

  pretendNowIs: (value, block) ->
    @testingOffset = _.now() - value
    if typeof block == 'function'
      try block()
      @testingOffset = 0
    @testingOffset

  resetNow: ->
    @timeOffset = 0

###
Date._now = Date.now
Date.now = ->
  @_now - _.timeOffset
real_now.class.at(real_now - Time.testing_offset)
###