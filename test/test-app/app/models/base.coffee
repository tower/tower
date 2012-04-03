class App.BaseModel extends Tower.Model
  @field "id", type: "Id"
  @field "likeCountWithoutDefault", type: "Integer"
  @field "likeCountWithDefault", type: "Integer", default: 0
  @field "tags", type: "Array", default: []
  @field "title"
  @field "nestedModels", type: ["NestedModel"], default: []
  @field "favorite", type: "Boolean", default: false
  @field "likeCount", type: "Integer", default: 0
  @field "custom",
    get: (value) ->
      value.join("-") if value
    set: (value) ->
      _.castArray(value)
  
class App.NestedModel extends Tower.Model
