class App.Membership extends Tower.Model
  @belongsTo "group"
  @belongsTo "user"