class Metro.Controller
  @Configuration: require './controller/configuration'
  @Callbacks:     require './controller/callbacks'
  @Errors:        require './controller/errors'
  @Flash:         require './controller/flash'
  @Responding:    require './controller/responding'
  @Rendering:     require './controller/rendering'
  
  @include @Configuration
  @include @Flash
  @include @Redirecting
  @include @Rendering
  @include @Responding
  
  constructor: ->
    @headers      = {}
    @status       = 200
    @request      = null
    @response     = null
    @content_type = "text/html"
    @params       = {}
    @query        = {}
  