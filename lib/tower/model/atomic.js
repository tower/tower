
  Tower.Model.Atomic = {
    ClassMethods: {
      inc: function(attribute, amount) {
        if (amount == null) amount = 1;
      }
    },
    inc: function(attribute, amount) {
      if (amount == null) amount = 1;
    }
  };

  module.exports = Tower.Model.Atomic;
