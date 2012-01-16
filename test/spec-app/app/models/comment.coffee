class TowerSpecApp.Comment extends Tower.Model
  @belongsTo "commentable", embed: true, polymorphic: true
  @belongsTo "commenter", type: "User"
  
global.Comment = TowerSpecApp.Comment
