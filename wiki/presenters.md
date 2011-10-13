# Presenters

Convert your post into a simple JSON api:

``` coffeescript
class Post.ShowPresenter
  @include Metro.Presenter
  
  render: ->
    post = Post.find(params.id)
    
    title:  post.title
    author: post.author.name
    body:   post.body
    tags:   _.map(post.tags, (tag) -> tag.name)
```

...so your controllers are lean:

``` coffeescript
class PostsController
  @include Metro.Controller
  
  show: ->
    @view = Post.ShowPresenter.new.render
```

...and your views are logic-less, and the app is ready for more complex pages like an analytics dashboard.

``` html
<body>
  <script>
    var post = #{@view.to_json};
  </script>
  <script id='post-template' type='text/html'>
    <article>
      <header>
        <h3>${title}</h3>
        <cite>By ${author}</cite>
      </header>
      <section>
        ${body}
      </section>
      <footer>
        <ul>
          {{each(tags, tag)}}
          <li>${tag}</li>
          {{/each}}
        </ul>
      </footer>
    </article>
  </script>
</body>
```

``` coffeescript
$(document).ready ->
  $("#post-template").tmpl(post).appendTo("body")
```