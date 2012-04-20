class App.Category extends Tower.Model
  @hasMany "children", type: "Category", foreignKey: "parentId"
  @belongsTo "parent", type: "Category", foreignKey: "parentId"
  @belongsTo "categorizable", embed: true, polymorphic: true
  
  # @hierarchical "parent", "child"
