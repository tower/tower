require '../lib/metro'
# require './secrets'

Metro.root        = process.cwd() + "/spec/spec-app"
Metro.publicPath  = Metro.root + "/public"
Metro.View.loadPaths = ["./spec/spec-app/app/views"]

Metro.Model.initialize()

beforeEach ->
  Metro.Application.teardown()
  Metro.Application.initialize()
  Metro.root        = process.cwd() + "/spec/spec-app"
  Metro.publicPath = Metro.root + "/public"
