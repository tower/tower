describe 'controller/server/attachmentTest', ->  
  uploadsDir = undefined
  faviconPath = undefined

  before ->
    uploadsDir = Tower.joinPath(Tower.srcRoot, 'tmp/uploads')
    faviconPath = Tower.joinPath(Tower.root, 'public/favicon.png')

  beforeEach (done) ->
    Tower.removeDirectorySync(uploadsDir)
    Tower.createDirectorySync(uploadsDir)
    Tower.start(done)

  afterEach ->
    Tower.removeDirectorySync(uploadsDir)
    Tower.stop()

  test 'upload image', (done) ->
    attachments =
      'attachment': faviconPath

    _.post '/attachments', attachments: attachments, (response) ->
      App.Attachment.first (error, attachment) =>
        assert.equal attachment.get('size'), Tower.sizeSync(faviconPath)
        done()