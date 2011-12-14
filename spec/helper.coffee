require '../lib/metro'
# require './secrets'

Metro.root            = process.cwd() + "/spec/spec-app"
Metro.publicPath      = Metro.root + "/public"
Metro.env             = "test"
Metro.View.loadPaths  = ["./spec/spec-app/app/views"]

Metro.Application.instance().initialize()

# You must either "extends X" or create a constructor: -> super
# so that coffeescript generates a callback to the parent class!
  
global.Category = class MetroSpecApp.Category extends Metro.Model
  @field "id"
  @hasMany "children", className: "Category", foreignKey: "parentId"
  @belongsTo "parent", className: "Category", foreignKey: "parentId"
  @belongsTo "post", embedded: true
  
  # @hierarchical "parent", "child"

global.User = class MetroSpecApp.User extends Metro.Model
  @field "id"
  @field "firstName"
  @field "createdAt", type: "Time", default: -> new Date()
  @field "likes", type: "Integer", default: 0
  @field "tags", type: "Array", default: []
  
  @scope "byBaldwin", firstName: "=~": "Baldwin"
  @scope "thisWeek", @where createdAt: ">=": -> require('moment')().subtract('days', 7)
  
  @hasMany "posts", className: "Page", cache: true # postIds
  
  @validate "firstName", presence: true

global.Page = class MetroSpecApp.Page extends Metro.Model
  @field "id"
  @field "title"
  @field "rating"#, min: 0, max: 1
  @field "type"
  
  @validate "rating", min: 0, max: 10
  
  @belongsTo "user", cache: true
  
global.Post = class MetroSpecApp.Post extends Page
  @hasMany "categories", embedded: true

beforeEach ->
  Metro.Application.instance().teardown()
  Metro.Application.instance().initialize()
  Metro.root          = process.cwd() + "/spec/spec-app"
  Metro.publicPath    = Metro.root + "/public"
  Metro.Support.Dependencies.load "#{Metro.root}/app/models"