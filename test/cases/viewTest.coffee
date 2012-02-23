require '../config'

view = null
user = null

describe 'Tower.View', ->
  beforeEach ->
    view = new Tower.View
    