class S3
  authenticate: (options) ->
    
  put: ->
  
  post: ->
  
  get: ->
    
  put_file: ->
  
  post_file: ->
  
  ###
  uploader = new Metro.Uploader "s3",
    key: '<api-key-here>'
    secret: '<secret-here>'
    bucket: 'learnboost'
  ###
  constructor: (options) ->
    @client = knox.createClient
      key: '<api-key-here>'
      secret: '<secret-here>'
      bucket: 'learnboost'

  upload: (from, to, callback) ->
    @client().putFile from, to, callback

  update: (remote, options) ->
    @client().put remote, options
