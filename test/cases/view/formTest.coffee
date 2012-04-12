view = null
user = null

describeWith = (store) ->
  describe "Tower.View.Form (Tower.Store.#{store.name})", ->
    beforeEach ->
      App.User.store(store)
      view = new Tower.View
    
    describe 'form', ->
      beforeEach (done) ->
        App.User.create firstName: "Lance", (error, record) =>
          user = record
          done()
      
      test '#formFor()', ->
        template = ->
          formFor()
      
        view.render template: template, (error, result) ->
          assert.equal result, """
<form action="/" id="model-form" role="form" novalidate="true" data-method="post" method="post">
  <input type="hidden" name="_method" value="post" />
</form>

"""
      test '#formFor(user)', ->
        template = ->
          formFor @user, (form) ->
            form.fieldset (fields) ->
              fields.field "firstName"
      
        view.render template: template, locals: user: user, (error, result) ->
          throw error if error
          assert.equal result, """
<form action="/users/#{user.get('id')}" id="user-form" role="form" novalidate="true" data-method="put" method="post">
  <input type="hidden" name="_method" value="put" />
  <fieldset>
    <ol class="fields">
      <li class="field control-group string optional" id="user-first-name-field">
        <label for="user-first-name-input" class="control-label">
          <span>First name</span>
          <abbr title="Optional" class="optional">
            
          </abbr>
        </label>
        <div class="controls">
          <input type="text" id="user-first-name-input" name="user[firstName]" value="Lance" class="string first-name optional input" aria-required="false" />
        </div>
      </li>
    </ol>
  </fieldset>
</form>

"""
      test '#formFor(user) with errors', ->
        user.set "firstName", null
        user.validate()
        assert.deepEqual user.errors, { firstName: [ 'firstName can\'t be blank' ] }
        template = ->
          formFor @user, (form) ->
            form.fieldset (fields) ->
              fields.field "firstName"

        view.render template: template, locals: user: user, (error, result) ->
          throw error if error
          assert.equal result, """
<form action="/users/#{user.get('id')}" id="user-form" role="form" novalidate="true" data-method="put" method="post">
  <input type="hidden" name="_method" value="put" />
  <fieldset>
    <ol class="fields">
      <li class="field control-group string optional" id="user-first-name-field">
        <label for="user-first-name-input" class="control-label">
          <span>First name</span>
          <abbr title="Optional" class="optional">
            
          </abbr>
        </label>
        <div class="controls">
          <input type="text" id="user-first-name-input" name="user[firstName]" class="string first-name optional input" aria-required="false" />
        </div>
      </li>
    </ol>
  </fieldset>
</form>

"""
      test '#formFor(camelCasedModel)', ->
        model = new App.CamelCasedModel(name: "something")
        template = ->
          formFor @model, (form) ->
            form.fieldset (fields) ->
              fields.field "name"
      
        view.render template: template, locals: model: model, (error, result) ->
          assert.equal result, """
<form action="/camel-cased-models" id="camel-cased-model-form" role="form" novalidate="true" data-method="post" method="post">
  <input type="hidden" name="_method" value="post" />
  <fieldset>
    <ol class="fields">
      <li class="field control-group string optional" id="camel-cased-model-name-field">
        <label for="camel-cased-model-name-input" class="control-label">
          <span>Name</span>
          <abbr title="Optional" class="optional">
            
          </abbr>
        </label>
        <div class="controls">
          <input type="text" id="camel-cased-model-name-input" name="camelCasedModel[name]" value="something" class="string name optional input" aria-required="false" />
        </div>
      </li>
    </ol>
  </fieldset>
</form>

"""
    
      describe 'fields', ->
        test 'string', ->
          user = new App.User(firstName: "Lance")
        
          template = ->
            formFor @user, (form) ->
              form.fieldset (fields) ->
                fields.field "firstName", as: "string"
        
          view.render template: template, locals: user: user, (error, result) ->
            throw error if error
            assert.equal result, """
<form action="/users" id="user-form" role="form" novalidate="true" data-method="post" method="post">
  <input type="hidden" name="_method" value="post" />
  <fieldset>
    <ol class="fields">
      <li class="field control-group string optional" id="user-first-name-field">
        <label for="user-first-name-input" class="control-label">
          <span>First name</span>
          <abbr title="Optional" class="optional">
            
          </abbr>
        </label>
        <div class="controls">
          <input type="text" id="user-first-name-input" name="user[firstName]" value="Lance" class="string first-name optional input" aria-required="false" />
        </div>
      </li>
    </ol>
  </fieldset>
</form>

"""

        test 'text', ->
          user = new App.User(firstName: "Lance")
          
          template = ->
            formFor @user, (form) ->
              form.fieldset (fields) ->
                fields.field "firstName", as: "text"
        
          view.render template: template, locals: user: user, (error, result) ->
            throw error if error
            assert.equal result, """
<form action="/users" id="user-form" role="form" novalidate="true" data-method="post" method="post">
  <input type="hidden" name="_method" value="post" />
  <fieldset>
    <ol class="fields">
      <li class="field control-group text optional" id="user-first-name-field">
        <label for="user-first-name-input" class="control-label">
          <span>First name</span>
          <abbr title="Optional" class="optional">
            
          </abbr>
        </label>
        <div class="controls">
          <textarea id="user-first-name-input" name="user[firstName]" class="text first-name optional input" aria-required="false">Lance</textarea>
        </div>
      </li>
    </ol>
  </fieldset>
</form>

"""

        test 'array', ->
          post = new App.Post(tags: ["ruby", "javascript"])
        
          template = ->
            formFor @post, (form) ->
              form.fieldset (fields) ->
                fields.field "tags", as: "array"
        
          view.render template: template, locals: post: post, (error, result) ->
            throw error if error
            assert.equal result, """
<form action="/posts" id="post-form" role="form" novalidate="true" data-method="post" method="post">
  <input type="hidden" name="_method" value="post" />
  <fieldset>
    <ol class="fields">
      <li class="field control-group array optional" id="post-tags-field">
        <label for="post-tags-input" class="control-label">
          <span>Tags</span>
          <abbr title="Optional" class="optional">
            
          </abbr>
        </label>
        <div class="controls">
          <input data-type="array" id="post-tags-input" name="post[tags]" value="ruby, javascript" class="array tags optional input" aria-required="false" />
        </div>
      </li>
    </ol>
  </fieldset>
</form>

"""
  ###
        test 'date', ->
          post = new App.Post(createdAt: new Date())
        
          template = ->
            formFor @post, (form) ->
              form.fieldset (fields) ->
                fields.field "createdAt", as: "date"
        
          view.render template: template, locals: post: post, (error, result) ->
            console.log result
            throw error if error
            assert.equal result, """

  """

        test 'time', ->
          post = new App.Post(createdAt: new Date())
        
          template = ->
            formFor @post, (form) ->
              form.fieldset (fields) ->
                fields.field "createdAt", as: "time"
        
          view.render template: template, locals: post: post, (error, result) ->
            console.log result
            throw error if error
            assert.equal result, """

  """

        test 'datetime', ->
          post = new App.Post(createdAt: new Date())
        
          template = ->
            formFor @post, (form) ->
              form.fieldset (fields) ->
                fields.field "createdAt", as: "datetime"
        
          view.render template: template, locals: post: post, (error, result) ->
            console.log result
            throw error if error
            assert.equal result, """

  """
  ###

describeWith(Tower.Store.Memory)
#describeWith(Tower.Store.MongoDB)
