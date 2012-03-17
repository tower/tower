class App.Page extends Tower.Model
  @field "id", type: "Id"
  @field "title"
  @field "rating", type: "Integer"#, min: 0, max: 1
  @field "type"
  @field "tags", type: ["String"], default: []
  # nested fields
  @field "meta", ->
    @field "priority": 1
  
  @validates "rating", min: 0, max: 10
  
  @belongsTo "user", cache: true
  @hasMany "comments", as: "commentable", type: "Comment"
  @hasMany "commenters", through: "comments", type: "User"
  
  @timestamps()
