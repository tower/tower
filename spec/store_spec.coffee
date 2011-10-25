require('./helper')

describe "store", ->
  describe "memory store", ->
    beforeEach ->
      @store = new Metro.Store.Memory
      
    it 'should store objects', ->
      