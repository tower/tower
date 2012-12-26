describe 'MonkeysController', ->
  controller = undefined
  monkey = undefined
  url = undefined

  beforeEach (done) ->
    controller = App.MonkeysController.create()
    agent.controller = controller
    Tower.start(done)

  afterEach ->
    Tower.stop()
    delete agent.controller

  describe 'routes', ->
    test 'index', ->
      assert.equal urlFor(App.Monkey), "/monkeys"

    test 'new', ->
      monkey = App.Monkey.build()
      assert.equal urlFor(monkey, action: 'new'), "/monkeys/new"

    test 'show', ->
      monkey = new App.Monkey(id: 1)
      assert.equal urlFor(monkey), "/monkeys/#{monkey.get('id')}"

    test 'edit', ->
      monkey = new App.Monkey(id: 1)
      assert.equal urlFor(monkey, action: 'edit'), "/monkeys/#{monkey.get('id')}/edit"

  describe '#index', ->
    beforeEach (done) ->
      factory 'monkey', (error, record) =>
        monkey = record
        done()

    test 'render json', (done) ->
      get urlFor(App.Monkey), format: "json", (request) ->
        assert.equal @headers["Content-Type"], 'application/json'

        done()

  describe '#new', ->

  describe '#create', ->
    beforeEach ->
      url = urlFor(App.Monkey)

    test 'params', (done) ->
      params = {}

      post url, format: "json", params: params, (response) ->
        App.Monkey.count (error, count) =>
          assert.equal count, 1
          done()

  describe "#show", ->

  describe "#edit", ->

  describe "#update", ->

  describe "#destroy", ->
