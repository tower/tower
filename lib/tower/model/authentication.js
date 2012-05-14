
Tower.Model.Authentication = {
  ClassMethods: {
    authenticated: function() {
      this.field('passwordDigest');
      this.field('passwordSalt');
      this.field('lastLoginAt', {
        type: 'Date'
      });
      this.field('lastLoginAt', {
        type: 'Date'
      });
      this.validates('password', {
        confirmation: true
      });
      this.validates('passwordDigest', {
        presence: true
      });
      this.before('validate', '_setPasswordDigest');
      this["protected"]('passwordDigest', 'passwordSalt');
      return this.include(Tower.Model.Authentication._InstanceMethods);
    }
  },
  _InstanceMethods: {
    authenticate: function(unencryptedPassword, callback) {
      if (this._encryptedPassword(unencryptedPassword) === this.get('passwordDigest')) {
        this.updateAttributes({
          lastLoginAt: new Date
        }, callback);
        return true;
      } else {
        if (callback) {
          callback.call(this, new Error('Invalid password'));
        }
        return false;
      }
    },
    _encryptedPassword: function(unencryptedPassword) {
      return require('crypto').createHmac('sha1', this.get('passwordSalt')).update(unencryptedPassword).digest('hex');
    },
    _generatePasswordSalt: function() {
      return Math.round(new Date().valueOf() * Math.random()).toString();
    },
    _setPasswordDigest: function() {
      var password;
      if (password = this.get('password')) {
        this.set('passwordSalt', this._generatePasswordSalt());
        this.set('passwordDigest', this._encryptedPassword(password));
      }
      return true;
    }
  }
};

module.exports = Tower.Model.Authentication;
