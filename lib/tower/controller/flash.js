
Tower.Controller.Flash = {
  InstanceMethods: {
    flash: function(type, msg) {
      var arr, msgs;
      msgs = this.session.flash = this.session.flash || {};
      if (type && msg) {
        return msgs[type] = String(msg);
      } else if (type) {
        arr = msgs[type];
        delete msgs[type];
        return String(arr || "");
      } else {
        this.session.flash = {};
        return msgs;
      }
    }
  }
};

module.exports = Tower.Controller.Flash;
