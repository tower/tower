class App.Child extends Tower.Model
  @field "id", type: "Id"
  @field "value"
  @hasMany "parents"#, cache: true, counterCache: true
  
  # embed tests
  @belongsTo "embeddableParent", embed: true, type: "Parent", inverseOf: "embeddedChildren"

  # inverseOf tests
  @belongsTo "noInverse_noInverse", type: "Parent"
  @belongsTo "noInverse_withInverse", type: "Parent"
  @belongsTo "withInverse_withInverse", type: "Parent", inverseOf: "withInverse_withInverse"
  @belongsTo "withInverse_noInverse", type: "Parent", inverseOf: "noInverse_withInverse"
  