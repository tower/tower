
Tower.Model.Hierarchical = {
  ClassMethods: {
    hierarchical: function(options) {
      if (options == null) {
        options = {};
      }
      this.metadata().lft = options.lft || (options.lft = "lft");
      this.metadata().rgt = options.rgt || (options.rgt = "rgt");
      this.metadata().parentId = options.parentId || (options.parentId = "parentId");
      this.field(options.lft, {
        type: "Integer"
      });
      this.field(options.rgt, {
        type: "Integer"
      });
      return this.field(options.parentId, {
        type: "Integer"
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
        "<=": this.get("lft")
      },
      rgt: {
        ">=": this.get("rgt")
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
        ">=": this.get("lft")
      },
      rgt: {
        "<=": this.get("rgt")
      }
    });
  },
  descendants: function() {
    return this.withoutSelf(this.selfAndDescendants());
  },
  isDescendantOf: function(other) {
    return other.get("left") < this.get("left") && this.get("left") < this.get("right") && (typeof this.sameScope === "function" ? this.sameScope(other) : void 0);
  },
  moveLeft: function() {
    return this.moveToLeftOf(this.leftSibling());
  },
  moveRight: function() {
    return this.moveToRightOf(this.rightSibling());
  },
  moveToLeftOf: function(node) {
    return this.moveTo(node, "left");
  },
  moveToRightOf: function(node) {
    return this.moveTo(node, "right");
  },
  moveToChildOf: function(node) {
    return this.moveTo(node, "child");
  },
  moveToRoot: function() {
    return this.moveTo(null, "root");
  },
  moveTo: function(target, position) {
    return this.runCallbacks("move", function() {});
  },
  isOrIsDescendantOf: function(other) {
    return other.left <= self.left && self.left < other.right && (typeof sameScope === "function" ? sameScope(other) : void 0);
  },
  isAncestorOf: function(other) {
    return self.left < other.left && other.left < self.right && (typeof sameScope === "function" ? sameScope(other) : void 0);
  },
  isOrIsAncestorOf: function(other) {
    return self.left <= other.left && other.left < self.right && (typeof sameScope === "function" ? sameScope(other) : void 0);
  },
  sameScope: function(other) {
    return Array(actsAsNestedSetOptions.scope).all(function(attr) {
      return self.send(attr) === other.send(attr);
    });
  },
  leftSibling: function() {
    return siblings.where(["" + self["class"].quotedTableName + "." + quotedLeftColumnName + " < ?", left]).order("" + self["class"].quotedTableName + "." + quotedLeftColumnName + " DESC").last;
  },
  rightSibling: function() {
    return siblings.where(["" + self["class"].quotedTableName + "." + quotedLeftColumnName + " > ?", left]).first;
  }
};

module.exports = Tower.Model.Hierarchical;
