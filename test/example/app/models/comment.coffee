class App.Comment extends Tower.Model
  @belongsTo "commentable", embed: true, polymorphic: true
  @belongsTo "commenter", type: "User"

  @belongsTo "embeddingPost", type: "Post", embed: true
  @belongsTo "referencedPost", type: "Post"