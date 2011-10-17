_ = require("underscore")
_.mixin(require("underscore.string"))

class Mapper extends Class
  constructor: (collection) ->
    @collection = collection
  
  match: ->
    @scope ?= {}
    @collection.add(new Metro.Routes.Route(@_extract_options(arguments...)))
    
  get: ->
    @match_method("get", arguments...)
    
  post: ->
    @match_method("post", arguments...)
    
  put: ->
    @match_method("put", arguments...)
    
  delete: ->
    @match_method("delete", arguments...)
    
  match_method: (method) ->
    options = arguments.pop()
    options.via = method
    arguments.push(options)
    @match(options)
    @
    
  scope: ->
    
  controller: (controller, options, block) ->
    options.controller = controller
    @scope(options, block)
  
  # Scopes routes to a specific namespace. For example:
  #
  #   namespace "admin", ->
  #     resources "posts"
  #
  # This generates the following routes:
  #
  #       admin_posts GET    /admin/posts(.:format)          admin/posts#index
  #       admin_posts POST   /admin/posts(.:format)          admin/posts#create
  #    new_admin_post GET    /admin/posts/new(.:format)      admin/posts#new
  #   edit_admin_post GET    /admin/posts/:id/edit(.:format) admin/posts#edit
  #        admin_post GET    /admin/posts/:id(.:format)      admin/posts#show
  #        admin_post PUT    /admin/posts/:id(.:format)      admin/posts#update
  #        admin_post DELETE /admin/posts/:id(.:format)      admin/posts#destroy
  #
  # === Options
  #
  # The +:path+, +:as+, +:module+, +:shallow_path+ and +:shallow_prefix+
  # options all default to the name of the namespace.
  #
  # For options, see <tt>Base#match</tt>. For +:shallow_path+ option, see
  # <tt>Resources#resources</tt>.
  #
  # === Examples
  #
  #   # accessible through /sekret/posts rather than /admin/posts
  #   namespace "admin", path: "sekret", ->
  #     resources "posts"
  #
  #   # maps to <tt>Sekret::PostsController</tt> rather than <tt>Admin::PostsController</tt>
  #   namespace "admin", module: "sekret", ->
  #     resources "posts"
  #
  #   # generates +sekret_posts_path+ rather than +admin_posts_path+
  #   namespace "admin", as: "sekret", ->
  #     resources "posts"
  namespace: (path, options, block) ->
    options = _.extend(path: path, as: path, module: path, shallow_path: path, shallow_prefix: path, options)
    @scope(options, block)
    
  # === Parameter Restriction
  # Allows you to constrain the nested routes based on a set of rules.
  # For instance, in order to change the routes to allow for a dot character in the +id+ parameter:
  #
  #   constraints id: /\d+\.\d+, ->
  #     resources "posts"
  #
  # Now routes such as +/posts/1+ will no longer be valid, but +/posts/1.1+ will be.
  # The +id+ parameter must match the constraint passed in for this example.
  #
  # You may use this to also restrict other parameters:
  #
  #   resources "posts", ->
  #     constraints post_id: /\d+\.\d+, ->
  #       resources "comments"
  #
  # === Restricting based on IP
  #
  # Routes can also be constrained to an IP or a certain range of IP addresses:
  #
  #   constraints ip: /192.168.\d+.\d+/, ->
  #     resources "posts"
  #
  # Any user connecting from the 192.168.* range will be able to see this resource,
  # where as any user connecting outside of this range will be told there is no such route.
  constraints: (options, block) ->
    @scope(constraints: options, block)
    
  # Allows you to set default parameters for a route, such as this:
  # 
  #   defaults id: 'home', ->
  #     match 'scoped_pages/(:id)', to: 'pages#show'
  # 
  # Using this, the `:id` parameter here will default to 'home'.
  defaults: (options, block) ->
    @scope(defaults: options, block)
  
  # Sometimes, you have a resource that clients always look up without
  # referencing an ID. A common example, /profile always shows the
  # profile of the currently logged in user. In this case, you can use
  # a singular resource to map /profile (rather than /profile/:id) to
  # the show action:
  #
  #   resource "geocoder"
  #
  # creates six different routes in your application, all mapping to
  # the +GeoCoders+ controller (note that the controller is named after
  # the plural):
  #
  #   GET     /geocoder/new
  #   POST    /geocoder
  #   GET     /geocoder
  #   GET     /geocoder/edit
  #   PUT     /geocoder
  #   DELETE  /geocoder
  #
  # === Options
  # Takes same options as +resources+.
  resource: ->
  
  # In Rails, a resourceful route provides a mapping between HTTP verbs
  # and URLs and controller actions. By convention, each action also maps
  # to particular CRUD operations in a database. A single entry in the
  # routing file, such as
  #
  #   resources "photos"
  #
  # creates seven different routes in your application, all mapping to
  # the +Photos+ controller:
  #
  #   GET     /photos/new
  #   POST    /photos
  #   GET     /photos/:id
  #   GET     /photos/:id/edit
  #   PUT     /photos/:id
  #   DELETE  /photos/:id
  #
  # Resources can also be nested infinitely by using this block syntax:
  #
  #   resources "photos", ->
  #     resources "comments"
  #
  # This generates the following comments routes:
  #
  #   GET     /photos/:photo_id/comments/new
  #   POST    /photos/:photo_id/comments
  #   GET     /photos/:photo_id/comments/:id
  #   GET     /photos/:photo_id/comments/:id/edit
  #   PUT     /photos/:photo_id/comments/:id
  #   DELETE  /photos/:photo_id/comments/:id
  #
  # === Options
  # Takes same options as <tt>Base#match</tt> as well as:
  #
  # [:path_names]
  #   Allows you to change the paths of the seven default actions.
  #   Paths not specified are not changed.
  #
  #     resources "posts", path_names: {new: "brand_new"}
  #
  #   The above example will now change /posts/new to /posts/brand_new
  #
  # [:only]
  #   Only generate routes for the given actions.
  #
  #     resources "cows", only: "show"
  #     resources "cows", only: ["show", "index"]
  #
  # [:except]
  #   Generate all routes except for the given actions.
  #
  #     resources :cows, :except => :show
  #     resources :cows, :except => [:show, :index]
  #
  # [:shallow]
  #   Generates shallow routes for nested resource(s). When placed on a parent resource,
  #   generates shallow routes for all nested resources.
  #
  #     resources "posts", shallow: true, ->
  #       resources "comments"
  #
  #   Is the same as:
  #
  #     resources :posts do
  #       resources :comments, :except => [:show, :edit, :update, :destroy]
  #     end
  #     resources :comments, :only => [:show, :edit, :update, :destroy]
  #
  #   This allows URLs for resources that otherwise would be deeply nested such
  #   as a comment on a blog post like <tt>/posts/a-long-permalink/comments/1234</tt>
  #   to be shortened to just <tt>/comments/1234</tt>.
  #
  # [:shallow_path]
  #   Prefixes nested shallow routes with the specified path.
  #
  #     scope shallow_path: "sekret", ->
  #       resources "posts", ->
  #         resources "comments", shallow: true
  #
  #   The +comments+ resource here will have the following routes generated for it:
  #
  #     post_comments    GET    /posts/:post_id/comments(.:format)
  #     post_comments    POST   /posts/:post_id/comments(.:format)
  #     new_post_comment GET    /posts/:post_id/comments/new(.:format)
  #     edit_comment     GET    /sekret/comments/:id/edit(.:format)
  #     comment          GET    /sekret/comments/:id(.:format)
  #     comment          PUT    /sekret/comments/:id(.:format)
  #     comment          DELETE /sekret/comments/:id(.:format)
  #
  # === Examples
  #
  #   # routes call <tt>Admin::PostsController</tt>
  #   resources "posts", module: "admin"
  #
  #   # resource actions are at /admin/posts.
  #   resources "posts", path: "admin/posts"
  resources: ->
  
  # To add a route to the collection:
  #
  #   resources "photos", ->
  #     collection ->
  #       get 'search'
  #
  # This will enable Rails to recognize paths such as <tt>/photos/search</tt>
  # with GET, and route to the search action of +PhotosController+. It will also
  # create the <tt>search_photos_url</tt> and <tt>search_photos_path</tt>
  # route helpers.
  collection: ->
  
  # To add a member route, add a member block into the resource block:
  #
  #   @resources "photos", ->
  #     @member ->
  #       @get 'preview'
  #
  # This will recognize <tt>/photos/1/preview</tt> with GET, and route to the
  # preview action of +PhotosController+. It will also create the
  # <tt>preview_photo_url</tt> and <tt>preview_photo_path</tt> helpers.
  member: ->
    
  root: (options) ->
    @match '/', _.extend(as: "root", options)
    
  _extract_options: ->
    path            = Metro.Routes.Route.normalize_path(arguments[0])
    options         = arguments[arguments.length - 1] || {}
    options.path    = path
    format          = @_extract_format(options)
    options.path    = @_extract_path(options)
    method          = @_extract_request_method(options)
    constraints     = @_extract_constraints(options)
    defaults        = @_extract_defaults(options)
    controller      = @_extract_controller(options)
    anchor          = @_extract_anchor(options)
    name            = @_extract_name(options)
    
    options         = _.extend options,
      method:         method
      constraints:    constraints
      defaults:       defaults
      name:           name
      format:         format
      controller:     controller
      anchor:         anchor
      ip:             options.ip
    
    options
    
  _extract_format: (options) ->
    
  _extract_name: (options) ->
    options.as
    
  _extract_constraints: (options) ->
    options.constraints || {}
    
  _extract_defaults: (options) ->
    options.defaults || {}
    
  _extract_path: (options) ->
    "#{options.path}.:format?"
    
  _extract_request_method: (options) ->
    options.via || options.request_method
  
  _extract_anchor: (options) ->
    options.anchor
    
  _extract_controller: (options) ->
    to = options.to.split('#')
    if to.length == 1
      action = to[0]
    else
      controller  = to[0]
      action      = to[1]
    
    controller   ?= (options.controller || @scope.controller)
    action       ?= (options.action || @scope.action)
    
    controller  = controller.toLowerCase().replace(/(?:_controller)?$/, "_controller")
    action      = action.toLowerCase()
    
    name: controller, action: action, class_name: _.camelize("_#{controller}")

exports = module.exports = Mapper
