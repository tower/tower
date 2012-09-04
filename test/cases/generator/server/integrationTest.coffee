      
###    
    describe 'GET actions', ->
      beforeEach (done) ->
        Tower.Route.clear()
        Tower.Route.draw ->
          @resources "posts"

        controller  = new App.PostsController()

        App.Post.destroy =>
          App.Post.create id: 1, rating: 8, title: "First Post", =>
            App.Post.create id: 2, rating: 9, title: "Second Post", done

      test '#index', ->
        output = """
<table summary="Table for Posts" role="grid" class="table">
  <thead>
    <tr scope="row">
      <td sort="sort"></td>
      <td role="gridcell"></td>
      <td role="gridcell"></td>
      <td role="gridcell"></td>
    </tr>
  </thead>
  <tbody>
    <tr scope="row" role="row">
      <td role="gridcell">
        First Post
      </td>
      <td role="gridcell">
        <a href="/posts/1" title="Show">Show</a>
      </td>
      <td role="gridcell">
        <a href="/posts/1/edit" title="Edit">Edit</a>
      </td>
      <td role="gridcell">
        <a method="delete" href="/posts/1" title="Destroy">Destroy</a>
      </td>
    </tr>
    <tr scope="row" role="row">
      <td role="gridcell">
        Second Post
      </td>
      <td role="gridcell">
        <a href="/posts/2" title="Show">Show</a>
      </td>
      <td role="gridcell">
        <a href="/posts/2/edit" title="Edit">Edit</a>
      </td>
      <td role="gridcell">
        <a method="delete" href="/posts/2" title="Destroy">Destroy</a>
      </td>
    </tr>
  </tbody>
  <a href="/posts/new" title="New Post">New Post</a>
</table>

"""
        Tower.get "index", controller: controller, ->
          console.log @body
          assert.equal output, @body
          assert.equal @headers["Content-Type"], "text/html"

      test '#new', ->
        output = """
<form action="/posts" id="post-form" role="form" novalidate="true" data-method="post" method="post">
  <input type="hidden" name="_method" value="post" />
  <fieldset>
    <ol class="fields">
      <li class="field string optional" id="post-title-field">
        <label for="post-title-input" class="label">
          <span>Title</span>
          <abbr title="Optional" class="optional">

          </abbr>
        </label>
        <input type="text" id="post-title-input" name="post[title]" class="string title optional input" aria-required="false" />
      </li>
    </ol>
  </fieldset>
  <fieldset>
    <ol class="fields">
      <li class="field submit" id="post-submit-field">
        <input type="submit" id="post-submit-input" class="submit" value="Submit" aria-required="false" />
      </li>
    </ol>
  </fieldset>
</form>

"""
        Tower.get "new", controller: controller, ->
          assert.equal output, @body
          assert.equal @headers["Content-Type"], "text/html"

      test '#edit', ->
        output = """
<form action="/posts/1" id="post-form" role="form" novalidate="true" data-method="put" method="post">
  <input type="hidden" name="_method" value="put" />
  <fieldset>
    <ol class="fields">
      <li class="field string optional" id="post-title-field">
        <label for="post-title-input" class="label">
          <span>Title</span>
          <abbr title="Optional" class="optional">

          </abbr>
        </label>
        <input type="text" id="post-title-input" name="post[title]" class="string title optional input" aria-required="false" />
      </li>
    </ol>
  </fieldset>
  <fieldset>
    <ol class="fields">
      <li class="field submit" id="post-submit-field">
        <input type="submit" id="post-submit-input" class="submit" value="Submit" aria-required="false" />
      </li>
    </ol>
  </fieldset>
</form>

"""
        Tower.get "edit", id: 1, controller: controller, ->
          assert.equal output, @body
          assert.equal @headers["Content-Type"], "text/html"

      test '#show', ->
        output = """
<dl class="content">
  <dt>Title:</dt>
  <dd>First Post</dd>
</dl>

"""
        Tower.get "show", id: 1, controller: controller, ->
          assert.equal output, @body
          assert.equal @headers["Content-Type"], "text/html"
###