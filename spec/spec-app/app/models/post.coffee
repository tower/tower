class TowerSpecApp.Post extends Page
  @hasMany "categories", embed: true, as: "categorizable"
  
  @field "likeCount", type: "Integer", default: 0
  
global.Post = TowerSpecApp.Post
