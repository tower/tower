var Serialization;
Serialization = (function() {
  function Serialization() {}
  Serialization.prototype.toXML = function() {};
  Serialization.prototype.toJSON = function() {
    return JSON.stringify(this.attributes);
  };
  Serialization.prototype.toObject = function() {};
  Serialization.prototype.clone = function() {};
  Serialization.fromJSON = function(data) {
    var i, record, records, _len;
    records = JSON.parse(data);
    if (!(records instanceof Array)) {
      records = [records];
    }
    for (i = 0, _len = records.length; i < _len; i++) {
      record = records[i];
      records[i] = new this(record);
    }
    return records;
  };
  return Serialization;
})();
module.exports = Serialization;