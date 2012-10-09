describe 'file paths', ->
  test 'Tower.pathSeparator', ->
    if process.platform == 'win32'
      expected = '\\'
    else
      expected = '/'

    assert.equal Tower.pathSeparator, expected

  test 'Tower.pathSeparatorEscaped', ->
    if process.platform == 'win32'
      expected = '\\\\'
    else
      expected = '\/'

    assert.equal Tower.pathSeparatorEscaped, expected

  test 'App.selectPaths', ->
    # @todo all paths should be returned as UNIX-style paths, so
    #   we don't have to litter the code with path.sep.
    root = Tower.joinPath(Tower.root, 'app/controllers/server')

    expected = _.map [
      'applicationController.coffee',
      'controllerScopesMetadataController.coffee',
      'customController.coffee',
      'headersController.coffee',
      'postsController.coffee',
      'sessionsController.coffee',
      'testJsonController.coffee',
      'testRoutesController.coffee',
      'usersController.coffee',
      'applicationController.coffee',
      'controllerScopesMetadataController.coffee',
      'customController.coffee',
      'headersController.coffee',
      'postsController.coffee',
      'sessionsController.coffee',
      'testJsonController.coffee',
      'testRoutesController.coffee',
      'usersController.coffee'
    ].sort(), (i) -> Tower.joinPath(root, i)

    assert.deepEqual App.selectPaths('app/controllers').sort(), expected