describe 'BirdsController', ->
  controller = undefined
  bird = undefined
  url = undefined

  beforeEach (done) ->
    controller = App.BirdsController.create()
    agent.controller = controller
    Tower.start(done)

  afterEach ->
    Tower.stop()
    delete agent.controller

  describe 'routes', ->
    test 'index', ->
      assert.equal urlFor(App.Bird), "/birds"

    test 'new', ->
      bird = App.Bird.build()
      assert.equal urlFor(bird, action: 'new'), "/birds/new"

    test 'show', ->
      bird = new App.Bird(id: 1)
      assert.equal urlFor(bird), "/birds/#{bird.get('id')}"

    test 'edit', ->
      bird = new App.Bird(id: 1)
      assert.equal urlFor(bird, action: 'edit'), "/birds/#{bird.get('id')}/edit"

  describe '#index', ->
    beforeEach (done) ->
      factory 'bird', (error, record) =>
        bird = record
        done()

    test 'render json', (done) ->
      get urlFor(App.Bird), format: "json", (request) ->
        assert.equal @headers["Content-Type"], 'application/json'

        done()

  describe '#new', ->

  describe '#create', ->
    beforeEach ->
      url = urlFor(App.Bird)

    test 'params', (done) ->
      params = {}

      post url, format: "json", params: params, (response) ->
        App.Bird.count (error, count) =>
          assert.equal count, 1
          done()

  describe "#show", ->

  describe "#edit", ->

  describe "#update", ->

  describe "#destroy", ->
