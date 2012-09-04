describe 'Tower.ViewEmberHelper', ->
  view = null

  beforeEach ->
    view = new Tower.View

  test '#findEmberView', ->  
    emberView = view.findEmberView('posts/index')
    emberView.append()
    
  test '#renderEmberView', ->  
    view.renderEmberView('posts/index')
    
    assert.ok Tower.stateManager.get('_currentView')
    
  describe 'ember', ->
    # @todo
    test 'index', ->
      return
      App.Post.destroy()
      Ember.TEMPLATES['posts/index'] = Ember.Handlebars.compile """
<ul id="posts-list">
  {{#each App.postsController.all}}
    <li>
      <a href="#" {{action "show"}}>{{title}}</a>
    </li>
  {{/each}}
</ul>
"""
      # going to look something like this in a day or two
      # class App.PostsController extends Tower.Controller
      #   all: App.Post.all()
      
      App.Post.create(rating: 8, title: "First Post!")

      App.subscribe 'posts', App.Post.all()
      
      App.setPath('postsController.all', App.posts)
      
      view.renderEmberView('posts/index')
      
      assert.equal $('#posts-list').html(), """
<li>
  <a href="#">First Post!</a>
</li>
"""
        
        
