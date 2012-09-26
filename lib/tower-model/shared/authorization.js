var _;

_ = Tower._;

Tower.ModelAuthorization = {
  ClassMethods: {
    accessibleBy: function(ability, action) {
      if (action == null) {
        action = 'index';
      }
    }
  }
};

module.exports = Tower.ModelAuthorization;
