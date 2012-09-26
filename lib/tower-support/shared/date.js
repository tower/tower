
Tower.SupportDate = {
  timeOffset: 0,
  timeZone: 'UTC',
  withTimeZone: function(block) {},
  pretendNowIs: function(value, block) {
    this.testingOffset = _.now() - value;
    if (typeof block === 'function') {
      try {
        block();
      } catch (_error) {}
      this.testingOffset = 0;
    }
    return this.testingOffset;
  },
  resetNow: function() {
    return this.timeOffset = 0;
  }
};

/*
Date._now = Date.now
Date.now = ->
  @_now - _.timeOffset
real_now.class.at(real_now - Time.testing_offset)
*/

