require '../../config'

controller  = null
user        = null
router      = null

describe 'Tower.Controller.Responding', ->
  test 'jsonOrYaml', ->
    Tower.get 'jsonOrYaml', format: "json", ->
      expect(@body).toEqual "JSON!"
      expect(@contentType).toEqual "application/json"
  