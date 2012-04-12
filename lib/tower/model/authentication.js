
Tower.Model.Authentication = {
  ClassMethods: {
    authenticated: function() {
      this.validates("password", {
        confirmation: true
      });
      this.validates("passwordDigest", {
        presence: true
      });
      this.protected("passwordDigest");
      return this.include(Tower.Model.Authentication._InstanceMethods);
    }
  },
  _InstanceMethods: {
    authenticate: function(unencryptedPassword) {
      if (require('crypto').bcript(passwordDigest) === unencryptedPassword) {
        return this;
      } else {
        return false;
      }
    },
    setPassword: function(unencryptedPassword) {
      this.password = unencryptedPassword;
      if (!_.isBlank(unencryptedPassword)) {
        return this.set("passwordDigest", require('crypto').bcript(unencryptedPassword));
      }
    }
  }
};

module.exports = Tower.Model.Authentication;
