class App.Project extends Tower.Model
  @field 'id', type: 'Id'
  @field 'titleIndexedWithOption', index: true
  @field 'titleIndexedWithMethod'
  
  @index 'titleIndexedWithMethod'