require './helper'

describe "store", ->
  describe "memory store", ->
    beforeEach ->
      @store = new Metro.Store.Memory
      
    afterEach ->
      @store.clear()
      
    it 'should store objects', ->
      expect(@store.count()).toEqual 0
      @store.create hello: "world", id: 1
      expect(@store.count()).toEqual 1
      
    it 'should clear', ->
      @store.create hello: "world", id: 1
      expect(@store.count()).toEqual 1
      @store.clear()
      expect(@store.count()).toEqual 0
    
    describe 'query', ->
      beforeEach ->
        @store.clear()
        @store.create hello: "world", id: 1
        @store.create hello: "halloween", id: 2
        @store.create hello: "lady gaga", id: 3

      it 'should select objects from equality match', ->
        expect(@store.count()).toEqual 3
        
        @store.select hello: "halloween", (records) ->
          expect(records.length).toEqual 1
          expect(records[0]).toEqual hello: "halloween", id: 2
        
      it 'should delete objects with equality match', ->
        expect(@store.count()).toEqual 3
        
        @store.remove hello: "halloween", (records) ->
          expect(records.length).toEqual 1
          expect(records[0]).toEqual hello: "halloween", id: 2
        
        expect(@store.count()).toEqual 2
        
      it 'should query with > operator', ->
        result = @store.find id: ">": 2
        
        expect(result).toEqual [
          {hello: "lady gaga", id: 3}
        ]
        
      it 'should query with >= operator', ->
        result = @store.find id: ">=": 2

        expect(result).toEqual [
          {hello: "halloween", id: 2}
          {hello: "lady gaga", id: 3}
        ]
        
      it 'should query with > and < operators', ->
        result = @store.find id: ">": 1, "<": 3
        
        expect(result).toEqual [
          {hello: "halloween", id: 2}
        ]
        
      it 'should query with =~ operator', ->
        result = @store.find hello: "=~": "a"
        
        expect(result).toEqual [
          {hello: "halloween", id: 2}
          {hello: "lady gaga", id: 3}
        ]
        
      it 'should query with !~ operator', ->
        result = @store.find hello: "!~": "a"
        
        expect(result).toEqual [
          {hello: "world", id: 1}
        ]
        
      it 'should query with != operator', ->
        result = @store.find hello: "!=": "lady gaga"
        
        expect(result).toEqual [
          {hello: "world", id: 1}
          {hello: "halloween", id: 2}
        ]
        
      it 'should query with != operator and sort', ->
        result = @store.find _sort: ["hello", "asc"], hello: "!=": "lady gaga"
        
        expect(result).toEqual [
          {hello: "halloween", id: 2}
          {hello: "world", id: 1}
        ]
        
      it 'should query with != operator and sort and limit', ->
        result = @store.find _sort: ["hello", "asc"], _limit: 1, hello: "!=": "lady gaga"
        
        expect(result).toEqual [
          {hello: "halloween", id: 2}
        ]
    
    describe 'sorting', ->
      beforeEach ->
        @store.clear()
        
      it 'should sort objects by one attribute ascending', ->  
        @store.create hello: "world", id: 1
        @store.create hello: "halloween", id: 2
        @store.create hello: "lady gaga", id: 3
        
        result = @store.sort(@store.all(), ["hello"])
        
        expect(result).toEqual [
          {hello: "halloween", id: 2}
          {hello: "lady gaga", id: 3}
          {hello: "world", id: 1}
        ]
      
      it 'should sort objects by one attribute descending', ->  
        @store.create hello: "world", id: 1
        @store.create hello: "halloween", id: 2
        @store.create hello: "lady gaga", id: 3
        
        result = @store.sort(@store.all(), ["hello", "desc"])

        expect(result).toEqual [
          {hello: "world", id: 1}
          {hello: "lady gaga", id: 3}
          {hello: "halloween", id: 2}
        ]
      
      it 'should sort objects by several attributes', ->  
        @store.create hello: "world", id: 1
        @store.create hello: "musica", id: 2
        @store.create hello: "world", id: 3
        @store.create hello: "musica", id: 4
        
        result = @store.sort(@store.all(), ["hello"], ["id", "desc"])
        
        expect(result).toEqual [
          {hello: "musica", id: 4}
          {hello: "musica", id: 2}
          {hello: "world", id: 3}
          {hello: "world", id: 1}
        ]
        
      it 'should sort objects by several attributes with callbacks', ->
        @store.create id: 1
        @store.create id: 2
        @store.create id: 3
        @store.create id: 4
        
        # if it's an even number, it should come first
        result = @store.sort @store.all(), ["id", "desc"], id: (id) -> 
          if id % 2 == 0 then 1 else 0
        
        expect(result).toEqual [
          {id: 4}
          {id: 2}
          {id: 3}
          {id: 1}
        ]
      