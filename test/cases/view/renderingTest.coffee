describe 'Tower.ViewRendering', ->
  view = null
  
  beforeEach ->
    view = Tower.View.create()
    
  describe '#_renderString', ->
    test 'coffee', (done) ->
      view._renderString 'h1 "Hello World"', type: 'coffee', (error, result) =>
        assert.equal '<h1>Hello World</h1>\n', result
      
        done()
  
  # _readTemplate(template, prefixes, ext)
  describe '#_readTemplate', ->
    test 'coffee', (done) ->
      
      done()
      
  describe '#_renderingContext', ->
    test 'default', ->
      assert.deepEqual view._renderingContext({}), {_context: {}}