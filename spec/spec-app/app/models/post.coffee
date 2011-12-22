class TowerSpecApp.Post extends Page
  @hasMany "categories", embed: true, as: "categorizable"
  
global.Post = TowerSpecApp.Post
