describe 'Tower.ModelIndexing', ->
  test '.index()', (done) ->
    indexes = App.Project.indexes()
    
    assert.ok indexes.hasOwnProperty('titleIndexedWithMethod')
    
    done()
    
  test 'index: true', (done) ->
    indexes = App.Project.indexes()
    
    assert.ok indexes.hasOwnProperty('titleIndexedWithOption')
    
    done()
      
