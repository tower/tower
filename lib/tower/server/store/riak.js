var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.Store.Riak = (function(_super) {

  __extends(Riak, _super);

  Riak.name = 'Riak';

  function Riak() {
    return Riak.__super__.constructor.apply(this, arguments);
  }

  return Riak;

})(Tower.Store);

module.exports = Tower.Store.Riak;
