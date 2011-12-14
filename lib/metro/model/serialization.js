
  Metro.Model.Serialization = {
    ClassMethods: {
      fromJSON: function(data) {
        var i, record, records, _len;
        records = JSON.parse(data);
        if (!(records instanceof Array)) records = [records];
        for (i = 0, _len = records.length; i < _len; i++) {
          record = records[i];
          records[i] = new this(record);
        }
        return records;
      },
      fromForm: function(data) {},
      fromXML: function(data) {},
      toJSON: function(records) {
        return JSON.stringify(records);
      }
    },
    toXML: function() {},
    toJSON: function() {
      return JSON.stringify(this.attributes);
    },
    toObject: function() {
      return this.attributes;
    },
    clone: function() {
      return new this.constructor(Metro.Support.Object.clone(this.attributes));
    }
  };

  module.exports = Metro.Model.Serialization;
