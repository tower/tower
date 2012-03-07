
Tower.Model.Sync = {
  sync: function() {
    var syncAction;
    var _this = this;
    syncAction = this.syncAction;
    return this.runCallbacks("sync", function() {
      return _this.runCallbacks("" + syncAction + "Sync", function() {
        return _this.store["" + syncAction + "Sync"](_this);
      });
    });
  },
  updateSyncAction: function(action) {
    return this.syncAction = (function() {
      switch (action) {
        case "delete":
          return "delete";
        case "update":
          switch (this.syncAction) {
            case "create":
              return "create";
            default:
              return "update";
          }
          break;
        default:
          switch (this.syncAction) {
            case "update":
              return "delete";
            default:
              return action;
          }
      }
    }).call(this);
  }
};

module.exports = Tower.Model.Sync;
