
Tower.Model.Hierarchical = {
  ClassMethods: {
    hierarchical: function() {
      this.field("lft", {
        type: "Integer"
      });
      this.field("rgt", {
        type: "Integer"
      });
      return this.field("parentId", {
        type: "Integer"
      });
    },
    root: function(callback) {
      return this.roots.first(callback);
    },
    roots: function() {
      return this.where({
        parentColumnName: null
      }).order(this.quotedLeftColumnName());
    },
    leaves: function() {
      return this.where("" + (this.quotedRightColumnName()) + " - " + (this.quotedLeftColumnName()) + " = 1").order(this.quotedLeftColumnName());
    }
  },
  isRoot: function() {
    return !!!this.get("parentId");
  },
  root: function(callback) {
    return this.selfAndAncestors.where({
      parentColumnName: null
    }).first(callback);
  },
  selfAndAncestors: function() {
    return this.nestedSetScope().where(["" + self["class"].quotedTableName + "." + quotedLeftColumnName + " <= ? AND " + self["class"].quotedTableName + "." + quotedRightColumnName + " >= ?", left, right]);
  },
  ancestors: function() {
    return this.withoutSelf(this.selfAndAncestors);
  },
  selfAndSiblings: function() {
    return this.nestedSetScope().where({
      parentColumnName: parentId
    });
  },
  siblings: function() {
    return this.withoutSelf(this.selfAndSiblings());
  },
  leaves: function() {
    return this.descendants().where("" + self["class"].quotedTableName + "." + quotedRightColumnName + " - " + self["class"].quotedTableName + "." + quotedLeftColumnName + " = 1");
  },
  level: function(callback) {
    if (get('parentId') === null) {
      return 0;
    } else {
      return ancestors().count(callback);
    }
  },
  selfAndDescendants: function() {
    return this.nestedSetScope().where(["" + self["class"].quotedTableName + "." + quotedLeftColumnName + " >= ? AND " + self["class"].quotedTableName + "." + quotedRightColumnName + " <= ?", left, right]);
  },
  descendants: function() {
    return this.withoutSelf(this.selfAndDescendants());
  },
  isDescendantOf: function(other) {
    return other.left < self.left && self.left < other.right && (typeof sameScope === "function" ? sameScope(other) : void 0);
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
  }
};

module.exports = Tower.Model.Hierarchical;
