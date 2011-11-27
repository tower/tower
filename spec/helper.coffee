require '../lib/metro'
# require './secrets'

Metro.root            = process.cwd() + "/spec/spec-app"
Metro.publicPath      = Metro.root + "/public"
Metro.env             = "test"
Metro.View.loadPaths  = ["./spec/spec-app/app/views"]

Metro.Application.instance().initialize()

beforeEach ->
  Metro.Application.instance().teardown()
  Metro.Application.instance().initialize()
  Metro.root          = process.cwd() + "/spec/spec-app"
  Metro.publicPath    = Metro.root + "/public"
