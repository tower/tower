
Tower.Model.Dirty = {
  InstanceMethods: {
    attributeChanged: function(name) {
      return this.get('changes').hasOwnProperty(name);
    },
    attributeChange: function(name) {},
    attributeWas: function(name) {
      return this.get('data').savedData[name];
    },
    resetAttribute: function(name) {
      return this.get('data').set(name, void 0);
    }
  }
};

module.exports = Tower.Model.Dirty;
