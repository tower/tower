(function() {
  var Time;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Time = (function() {
    Time._lib = function() {
      return require('moment');
    };
    Time.zone = function() {
      return this;
    };
    Time.now = function() {
      return new this();
    };
    function Time() {
      this.moment = this.constructor._lib()();
    }
    Time.prototype.toString = function() {
      return this._date.toString();
    };
    Time.prototype.beginningOfWeek = function() {};
    Time.prototype.week = function() {
      return parseInt(this.moment.format("w"));
    };
    Time.prototype.dayOfWeek = function() {
      return this.moment.day();
    };
    Time.prototype.dayOfMonth = function() {
      return parseInt(this.moment.format("D"));
    };
    Time.prototype.dayOfYear = function() {
      return parseInt(this.moment.format("DDD"));
    };
    Time.prototype.meridiem = function() {
      return this.moment.format("a");
    };
    Time.prototype.zoneName = function() {
      return this.moment.format("z");
    };
    Time.prototype.strftime = function(format) {
      return this.moment.format(format);
    };
    Time.prototype.beginningOfDay = function() {
      this.moment.seconds(0);
      return this;
    };
    Time.prototype.beginningOfWeek = function() {
      this.moment.seconds(0);
      this.moment.subtract('days', 6 - this.dayOfWeek());
      return this;
    };
    Time.prototype.beginningOfMonth = function() {
      this.moment.seconds(0);
      this.moment.subtract('days', 6 - this.dayOfMonth());
      return this;
    };
    Time.prototype.beginningOfYear = function() {
      this.moment.seconds(0);
      return this.moment.subtract('days', 6 - this.dayOfMonth());
    };
    Time.prototype.toDate = function() {
      return this.moment._d;
    };
    return Time;
  })();
  Time.TimeWithZone = (function() {
    __extends(TimeWithZone, Time);
    function TimeWithZone() {
      TimeWithZone.__super__.constructor.apply(this, arguments);
    }
    return TimeWithZone;
  })();
  module.exports = Time;
}).call(this);
