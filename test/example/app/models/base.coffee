class App.BaseModel extends Tower.Model
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
      
  @fields "a1", "a2", "a3"
  @fields "a4", "a5", "a6", type: "Integer"
  @fields o1: "String", o2: "Integer"
  
  @default "scope", title: "ABC"
  
class App.NestedModel extends Tower.Model
