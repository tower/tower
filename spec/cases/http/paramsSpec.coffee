require '../../config'

describe 'params', ->
  it 'should parse string', ->
    param   = new Tower.Net.Param.String("title", modelName: "User")
    
    result  = param.parse("-Hello+World")
    result  = result[0]
    
    expect(result[0].value).toEqual "Hello"
    expect(result[0].operators).toEqual ["!~"]
    
    expect(result[1].key).toEqual "title"
    expect(result[1].value).toEqual "World"
    expect(result[1].operators).toEqual ["=~"]
    
    Tower.Controller.params limit: 20, ->
      @param "title"

    controller  = new Tower.Controller
    controller.params.title = "Hello+World"
    criteria    = controller.criteria()
    expect(criteria.query).toEqual {title: "=~": "Hello World"}
    