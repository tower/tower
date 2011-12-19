require '../lib/coach'
# require './secrets'

Coach.root            = process.cwd() + "/spec/spec-app"
Coach.publicPath      = Coach.root + "/public"
Coach.env             = "test"
Coach.View.loadPaths  = ["./spec/spec-app/app/views"]

Coach.Application.instance().initialize()

# You must either "extends X" or create a constructor: -> super
# so that coffeescript generates a callback to the parent class!
  
global.Category = class CoachSpecApp.Category extends Coach.Model
  @field "id"
  @hasMany "children", className: "Category", foreignKey: "parentId"
  @belongsTo "parent", className: "Category", foreignKey: "parentId"
  @belongsTo "post", embedded: true
  
  # @hierarchical "parent", "child"

global.User = class CoachSpecApp.User extends Coach.Model
  @field "id"
  @field "firstName"
  @field "createdAt", type: "Time", default: -> new Date()
  @field "likes", type: "Integer", default: 0
  @field "tags", type: "Array", default: []
  
  @scope "byBaldwin", firstName: "=~": "Baldwin"
  @scope "thisWeek", @where createdAt: ">=": -> require('moment')().subtract('days', 7)
  
  @hasMany "posts", className: "Page", cache: true # postIds
  
  @validate "firstName", presence: true

global.Page = class CoachSpecApp.Page extends Coach.Model
  @field "id"
  @field "title"
  @field "rating"#, min: 0, max: 1
  @field "type"
  
  @validate "rating", min: 0, max: 10
  
  @belongsTo "user", cache: true
  
global.Post = class CoachSpecApp.Post extends Page
  @hasMany "categories", embedded: true

beforeEach ->
  Coach.Application.instance().teardown()
  Coach.Application.instance().initialize()
  Coach.root          = process.cwd() + "/spec/spec-app"
  Coach.publicPath    = Coach.root + "/public"
  Coach.Support.Dependencies.load "#{Coach.root}/app/models"