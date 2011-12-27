
Tower.Model.Timestamp = {
  ClassMethods: function() {
    return {
      timestamps: function() {
        this.include(Tower.Model.Timestamp.CreatedAt);
        return this.include(Tower.Model.Timestamp.UpdatedAt);
      }
    };
  },
  CreatedAt: {
    ClassMethods: {}
  },
  UpdatedAt: {
    ClassMethods: {}
  }
};

module.exports = Tower.Model.Timestamp;
