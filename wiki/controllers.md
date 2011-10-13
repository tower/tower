# Controllers

``` coffeescript
class PostsController
  @include Metro.Controller
  
  index: ->
    @posts = Post.all()
    
  new: ->
    @post = Post.new
    
  create: ->
    @post = Post.new(params.post)
    
    super (success, failure) ->
      success.html -> render "posts/edit"
      success.json -> render text: "success!"
      failure.html -> render text: "Error", status: 404
      failure.json -> render text: "Error", status: 404
    
  show: ->
    @post = Post.find(params.id)
    
  edit: ->
    @post = Post.find(params.id)
    
  update: ->
    @post = Post.find(params.id)
    
  destroy: ->
    @post = Post.find(params.id)
```

## Inherited Resources by Default

``` coffeescript
class PostsController
  @include Metro.ResourceController
```

*Todo