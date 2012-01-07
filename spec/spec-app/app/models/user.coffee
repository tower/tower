class TowerSpecApp.User extends Tower.Model
  @field "id"
  @field "firstName"
  @field "createdAt", type: "Time", default: -> new Date()
  @field "likes", type: "Integer", default: 0
  @field "tags", type: ["Array"], default: []
  
  @scope "byBaldwin", firstName: "=~": "Baldwin"
  @scope "thisWeek", @where createdAt: ">=": -> require('moment')().subtract('days', 7)
  
  @hasMany "posts", type: "Page", cache: true # postIds
  @hasMany "comments", source: "commenter"
  
  @validates "firstName", presence: true

global.User = TowerSpecApp.User
