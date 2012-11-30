describe 'Tower.File', ->
  path = null

  beforeEach ->
    path        = 'test/example/server.js'
  
  test 'stat', (done) ->
    assert.ok !!Tower.statSync(path)

    Tower.stat path, (error, stat) =>
      assert.ok !!stat
      done()

  test 'fingerprint', ->
    expected  = '67574c7b406bb0064c686db97d00943e'
    string    = Tower.readFileSync(path)

    assert.equal expected, Tower.fingerprint(string)

  test 'pathFingerprint', ->
    expected = '67574c7b406bb0064c686db97d00943e'

    assert.equal Tower.pathFingerprint("some/file-#{expected}.js"), expected

  test 'pathWithFingerprint', ->
    fingerprint = '67574c7b406bb0064c686db97d00943e'
    expected = "some/file-#{fingerprint}.js"

    assert.equal Tower.pathWithFingerprint('some/file.js', fingerprint), expected

  test 'contentType', ->
    expected = 'application/javascript'

    assert.equal Tower.contentType(path), expected
  
  test 'mtime', (done) ->
    assert.isTrue Tower.mtimeSync(path) instanceof Date

    Tower.mtime path, (error, mtime) =>
      assert.isTrue mtime instanceof Date
      done()

  test 'size', (done) ->
    expected = 343

    assert.equal Tower.sizeSync(path), expected

    Tower.size path, (error, size) =>
      assert.equal size, expected
      done()

  test 'should find entries in a directory', (done) ->
    dir = 'test/example/app/controllers/server'

    expected = [
      'applicationController.coffee',
      'attachmentsController.coffee',
      'controllerScopesMetadataController.coffee',
      'customController.coffee',
      'headersController.coffee',
      'postsController.coffee',
      'sessionsController.coffee',
      'testJsonController.coffee',
      'testRoutesController.coffee',
      'usersController.coffee'
    ].sort()

    assert.deepEqual Tower.entriesSync(dir).sort(), expected
    
    Tower.entries dir, (error, entries) =>
      assert.deepEqual entries.sort(), expected
      done()

  test 'absolutePath', ->
    expected = Tower.join(process.cwd(), path)

    assert.equal Tower.absolutePath(path), expected

  test 'relativePath', ->
    expected = path

    assert.equal Tower.relativePath(path), expected

  test 'extensions', ->
    expected = ['.js', '.coffee']

    assert.deepEqual Tower.extensions('something.js.coffee'), expected

  test 'glob files', ->
    dir = 'test/example/app/controllers/server'

    expected = _.map [
      'applicationController.coffee',
      'attachmentsController.coffee',
      'controllerScopesMetadataController.coffee',
      'customController.coffee',
      'headersController.coffee',
      'postsController.coffee',
      'sessionsController.coffee',
      'testJsonController.coffee',
      'testRoutesController.coffee',
      'usersController.coffee'
    ].sort(), (i) -> Tower.join(dir, i)

    assert.deepEqual Tower.files(dir).sort(), expected
    assert.deepEqual Tower.files([dir]).sort(), expected