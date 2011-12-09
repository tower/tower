require '../lib/metro'
# require './secrets'

Metro.root            = process.cwd() + "/spec/spec-app"
Metro.publicPath      = Metro.root + "/public"
Metro.env             = "test"
Metro.View.loadPaths  = ["./spec/spec-app/app/views"]

Metro.Application.instance().initialize()

# You must either "extends X" or create a constructor: -> super
# so that coffeescript generates a callback to the parent class!

global.User = class MetroSpecApp.User extends Metro.Model
  @key "id"
  @key "firstName"
  @key "createdAt", type: "time", default: -> new Date()
  
  @scope "byBaldwin", firstName: "=~": "Baldwin"
  @scope "thisWeek", @where createdAt: ">=": -> require('moment')().subtract('days', 7)
  
  @hasMany "posts", className: "Page", cache: true # postIds
  
  @validate "firstName", presence: true

global.Page = class MetroSpecApp.Page extends Metro.Model
  @key "id"
  @key "title"
  @key "rating"#, min: 0, max: 1
  
  @validate "rating", min: 0, max: 10
  
  @belongsTo "user"

beforeEach ->
  Metro.Application.instance().teardown()
  Metro.Application.instance().initialize()
  Metro.root          = process.cwd() + "/spec/spec-app"
  Metro.publicPath    = Metro.root + "/public"
  Metro.Support.Dependencies.load "#{Metro.root}/app/models"