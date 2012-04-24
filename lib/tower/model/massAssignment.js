
Tower.Model.MassAssigment = {
  ClassMethods: {
    "protected": function() {},
    accessible: function() {
      var args, options;
      args = _.args(arguments);
      return options = _.extractOptions(arguments);
    }
  }
};

module.exports = Tower.Model.MassAssigment;
