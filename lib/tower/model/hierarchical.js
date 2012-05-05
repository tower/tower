
Tower.Model.Hierarchical = {
  ClassMethods: {
    hierarchical: function(options) {
      if (options == null) {
        options = {};
      }
      this.metadata().lft = options.lft || (options.lft = 'lft');
      this.metadata().rgt = options.rgt || (options.rgt = 'rgt');
      this.metadata().parentId = options.parentId || (options.parentId = 'parentId');
      this.field(options.lft, {
        type: 'Integer'
      });
      this.field(options.rgt, {
        type: 'Integer'
      });
      return this.field(options.parentId, {
        type: 'Integer'
      });
    },
    root: function(callback) {
      return this.roots().first(callback);
    },
    roots: function() {
      var conditions, metadata;
      metadata = this.metadata();
      conditions = {};
      conditions[metadata.parentId] = null;
      return this.where(conditions).asc(metadata.lft);
    },
    leaves: function() {
      var metadata;
      metadata = this.metadata();
      return this.where("" + metadata.rgt + " - " + metadata.lft + " = 1").asc(metadata.lft);
    }
  },
  isRoot: function() {
    return !!!this.get(this.metadata().parentId);
  },
  root: function(callback) {
    var conditions, metadata;
    metadata = this.metadata();
    conditions = {};
    conditions[metadata.parentId] = null;
    return this.selfAndAncestors.where(conditions).first(callback);
  },
  selfAndAncestors: function() {
    return this.nestedSetScope().where({
      lft: {
        '<=': this.get('lft')
      },
      rgt: {
        '>=': this.get('rgt')
      }
    });
  },
  ancestors: function() {
    return this.withoutSelf(this.selfAndAncestors);
  },
  selfAndSiblings: function() {
    var conditions, metadata;
    metadata = this.metadata();
    conditions = {};
    conditions[metadata.parentId] = this.get(metadata.parentId);
    return this.nestedSetScope().where(conditions);
  },
  siblings: function() {
    return this.withoutSelf(this.selfAndSiblings());
  },
  leaves: function() {
    var metadata;
    metadata = this.metadata();
    return this.descendants().where("" + metadata.rgt + " - " + metadata.lft + " = 1").asc(metadata.lft);
  },
  level: function(callback) {
    var metadata;
    metadata = this.metadata();
    if (this.get(metadata.parentId) === null) {
      return 0;
    } else {
      return this.ancestors().count(callback);
    }
  },
  selfAndDescendants: function() {
    return this.nestedSetScope().where({
      lft: {
        '>=': this.get('lft')
      },
      rgt: {
        '<=': this.get('rgt')
      }
    });
  },
  descendants: function() {
    return this.withoutSelf(this.selfAndDescendants());
  },
  isDescendantOf: function(other) {
    return other.get('left') < this.get('left') && this.get('left') < this.get('right') && this.isSameScope(other);
  },
  moveLeft: function() {
    return this.moveToLeftOf(this.leftSibling());
  },
  moveRight: function() {
    return this.moveToRightOf(this.rightSibling());
  },
  moveToLeftOf: function(node) {
    return this.moveTo(node, 'left');
  },
  moveToRightOf: function(node) {
    return this.moveTo(node, 'right');
  },
  moveToChildOf: function(node) {
    return this.moveTo(node, 'child');
  },
  moveToRoot: function() {
    return this.moveTo(null, 'root');
  },
  moveTo: function(target, position) {
    return this.runCallbacks('move', function() {});
  },
  isOrIsDescendantOf: function(other) {
    return other.get('left') <= this.get('left') && this.get('left') < other.get('right') && this.isSameScope(other);
  },
  isAncestorOf: function(other) {
    return this.get('left') < other.get('left') && other.get('left') < this.get('right') && this.isSameScope(other);
  },
  isOrIsAncestorOf: function(other) {
    return this.get('left') <= other.get('left') && other.get('left') < this.get('right') && this.isSameScope(other);
  },
  isSameScope: function(other) {
    return Array(actsAsNestedSetOptions.scope).all(function(attr) {
      return this.get(attr) === other.get(attr);
    });
  },
  leftSibling: function(callback) {
    var conditions, metadata;
    metadata = this.constructor.metadata();
    conditions = {};
    conditions[metadata.lft] = {
      $lt: this.get('left')
    };
    return siblings.where(conditions).desc(metadata.lft).last(callback);
  },
  rightSibling: function(callback) {
    var conditions, metadata;
    metadata = this.constructor.metadata();
    conditions = {};
    conditions[metadata.left] = {
      $gt: this.get('left')
    };
    return siblings.where(conditions).first(callback);
  }
};

module.exports = Tower.Model.Hierarchical;
