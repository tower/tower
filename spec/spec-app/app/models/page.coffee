class TowerSpecApp.Page extends Tower.Model
  @field "id"
  @field "title"
  @field "rating"#, min: 0, max: 1
  @field "type"
  
  @validates "rating", min: 0, max: 10
  
  @belongsTo "user", cache: true
  @hasMany "comments", as: "commentable", type: "Comment"
  @hasMany "commenters", through: "comments", type: "User"
  
  @timestamps()
  
global.Page = TowerSpecApp.Page
