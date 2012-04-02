class App.Group extends Tower.Model
  @hasMany "memberships"
  @hasMany "users", through: "memberships"