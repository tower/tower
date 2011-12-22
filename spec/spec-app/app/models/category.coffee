class TowerSpecApp.Category extends Tower.Model
  @field "id"
  @hasMany "children", className: "Category", foreignKey: "parentId"
  @belongsTo "parent", className: "Category", foreignKey: "parentId"
  @belongsTo "categorizable", embed: true, polymorphic: true
  
  # @hierarchical "parent", "child"

global.Category = TowerSpecApp.Category
