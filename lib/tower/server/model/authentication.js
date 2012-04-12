
Tower.Model.Authentication = {
  ClassMethods: {
    authenticated: function() {
      this.validates("password", {
        confirmation: true
      });
      this.validates("passwordDigest", {
        presence: true
      });
      return this.protected("passwordDigest");
    }
  }
};
