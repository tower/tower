describe "Tower.Controller (Integration)", ->
  beforeEach (done) ->
    Tower.start(done)
  
  afterEach ->
    Tower.stop()

  #test "sign-in", (done) ->
  #  get "/sign-in", (response) =>
  #    assert.deepEqual "Login", response.text
  #    done()
  #
  #test "/custom/renderHelloWorld", (done) ->
  #  get "/custom/renderHelloWorld", (response) ->
  #    assert.equal "CustomController", @constructor.name
  #    assert.deepEqual "Hello world...!", response.text
  #    done()

  test "App.CamelCasedControllerName and routes"

  test 'ip address', (done) ->
    _.get '/custom/testIP', (response) ->
      assert.equal response.text, '127.0.0.1'
      done()

  describe "/test-routes", ->
    test "/get", (done) ->
      _.get "/test-routes/get", (response) ->
        assert.equal "getMethod called", response.text
        assert.equal 200, response.status
      
        _.post "/test-routes/get", (response) ->
          assert.equal 404, response.status
          done()
        
    test "/post", (done) ->
      _.get "/test-routes/post", (response) ->
        assert.equal 404, response.status
      
        _.post "/test-routes/post", (response) ->
          assert.equal "postMethod called", response.text
          assert.equal 200, response.status
          done()
        
    test "/put", (done) ->
      _.get "/test-routes/put", (response) ->
        assert.equal 404, response.status
      
        _.post "/test-routes/put", (response) ->
          assert.equal 404, response.status
        
          _.put "/test-routes/put", (response) ->
            assert.equal "putMethod called", response.text
            assert.equal 200, response.status
            done()
  
    test "/delete", (done) ->
      _.get "/test-routes/delete", (response) ->
        assert.equal 404, response.status

        _.post "/test-routes/delete", (response) ->
          assert.equal 404, response.status

          _.put "/test-routes/delete", (response) ->
            assert.equal 404, response.status
          
            _.destroy "/test-routes/delete", (response) ->
              assert.equal "deleteMethod called", response.text
              assert.equal 200, response.status
              done()
  
    test "/get-post", (done) ->
      _.get "/test-routes/get-post", (response) ->
        assert.equal "getPostMethod called", response.text
        assert.equal 200, response.status

        _.post "/test-routes/get-post", (response) ->
          assert.equal "getPostMethod called", response.text
          done()
        
  describe "json", ->
    test "/test-json/default should return HTML", (done) ->
      _.get "/test-json/default", (response) ->
        assert.equal 'defaultMethod in HTML', response.text
        assert.equal 200, response.status
      
        done()
      
    test "/test-json/default.json", (done) ->
      _.get "/test-json/default.json", (response) ->
        assert.deepEqual { value: 'defaultMethod in JSON' }, response.body
        assert.equal 200, response.status
      
        done()
      
    test "/test-json/default headers: accept: application/json", (done) ->
      _.get "/test-json/default", headers: 'accept': 'application/json', (response) ->
        assert.deepEqual { value: 'defaultMethod in JSON' }, response.body
        assert.equal 200, response.status

        done()
      
    test "POST /test-json/post headers: accept: application/json", (done) ->
      data =
        headers:
          'accept': 'application/json'
        params:
          data:
            postData: "JSON!"
    
      _.post "/test-json/post", data, (response) ->
        assert.deepEqual { postData: 'JSON!' }, response.body
        assert.equal 200, response.status

        done()
  
    # content negotiation: https://github.com/visionmedia/express/blob/master/examples/content-negotiation/index.js
    # test "/test-json/default headers: accept: application/json", (done) ->
    #   get "/test-json/default", headers: 'accept': 'text/html,application/xhtml+xml,application/json;q=0.9,q=0.8;*/*', (response) ->
    #     assert.deepEqual { value: 'defaultMethod in JSON' }, response.body
    #     assert.equal 200, response.status
    # 
    #     done()
