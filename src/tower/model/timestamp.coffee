Tower.Model.Timestamp =
  ClassMethods: ->
    timestamps: ->
      @include Tower.Model.Timestamp.CreatedAt
      @include Tower.Model.Timestamp.UpdatedAt
      
  CreatedAt:
    ClassMethods: {}
  
  UpdatedAt:
    ClassMethods: {}

module.exports = Tower.Model.Timestamp
