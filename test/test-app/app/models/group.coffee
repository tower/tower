class App.Group extends Tower.Model
  @field "name"
  
  @hasMany "memberships", dependent: "destroy"
  @hasMany "users", through: "memberships"