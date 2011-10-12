var Metro, exports;
var __hasProp = Object.prototype.hasOwnProperty;
Metro = {
  Asset: require('../lib/asset').Asset,
  Support: require('../lib/support').Support,
  configure: function(callback) {
    var _i, _j, _ref, _ref2, _result, _result2, asset_key, config, key, self;
    self = this;
    config = {
      assets: {}
    };
    callback.apply(config);
    _result = []; _ref = config;
    for (key in _ref) {
      if (!__hasProp.call(_ref, key)) continue;
      _i = _ref[key];
      _result.push((function() {
        switch (key) {
          case "assets":
            _result2 = []; _ref2 = config[key];
            for (asset_key in _ref2) {
              if (!__hasProp.call(_ref2, asset_key)) continue;
              _j = _ref2[asset_key];
              _result2.push(self.Asset.config[asset_key] = config[key][asset_key]);
            }
            return _result2;
            break;
        }
      })());
    }
    return _result;
  }
};
exports = (module.exports = Metro);