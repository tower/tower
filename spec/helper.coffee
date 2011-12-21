require '../lib/tower'
# require './secrets'

Tower.root            = process.cwd() + "/spec/spec-app"
Tower.publicPath      = Tower.root + "/public"
Tower.env             = "test"
Tower.View.loadPaths  = ["./spec/spec-app/app/views"]

Tower.Application.instance().initialize()

# You must either "extends X" or create a constructor: -> super
# so that coffeescript generates a callback to the parent class!
  
global.Category = class TowerSpecApp.Category extends Tower.Model
  @field "id"
  @hasMany "children", className: "Category", foreignKey: "parentId"
  @belongsTo "parent", className: "Category", foreignKey: "parentId"
  @belongsTo "post", embedded: true
  
  # @hierarchical "parent", "child"

global.User = class TowerSpecApp.User extends Tower.Model
  @field "id"
  @field "firstName"
  @field "createdAt", type: "Time", default: -> new Date()
  @field "likes", type: "Integer", default: 0
  @field "tags", type: "Array", default: []
  
  @scope "byBaldwin", firstName: "=~": "Baldwin"
  @scope "thisWeek", @where createdAt: ">=": -> require('moment')().subtract('days', 7)
  
  @hasMany "posts", className: "Page", cache: true # postIds
  
  @validates "firstName", presence: true

global.Page = class TowerSpecApp.Page extends Tower.Model
  @field "id"
  @field "title"
  @field "rating"#, min: 0, max: 1
  @field "type"
  
  @validates "rating", min: 0, max: 10
  
  @belongsTo "user", cache: true
  
global.Post = class TowerSpecApp.Post extends Page
  @hasMany "categories", embedded: true

beforeEach ->
  Tower.Application.instance().teardown()
  Tower.Application.instance().initialize()
  Tower.root          = process.cwd() + "/spec/spec-app"
  Tower.publicPath    = Tower.root + "/public"
  Tower.Support.Dependencies.load "#{Tower.root}/app/models"