class App.User extends Tower.Model
  @field "id", type: "Id"
  @field "firstName"
  @field "createdAt", type: "Time", default: -> new Date()
  @field "likes", type: "Integer", default: 0
  @field "tags", type: ["Array"], default: []
  
  @scope "byBaldwin", firstName: "=~": "Baldwin"
  @scope "thisWeek", @where createdAt: ">=": -> require('moment')().subtract('days', 7)
  
  @hasMany "posts", type: "Page", idCache: true # postIds
  @hasMany "comments", source: "commenter"
  
  @hasMany "memberships"
  @hasMany "groups", through: "memberships"
  
  @hasMany "polymorphicMemberships", as: "joinable", type: "Membership"
  @hasMany "cachedMemberships", type: "Membership", idCache: true
  #@hasMany "dependentMemberships", type: "DependentMembership", dependent: true
  
  @validates "firstName", presence: true
  
  @timestamps()
