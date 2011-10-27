require '../lib/metro'
# require './secrets'

Metro.root        = process.cwd() + "/spec/spec-app"
Metro.public_path = Metro.root + "/public"

beforeEach ->
  Metro.Application.teardown()
  Metro.Application.initialize()