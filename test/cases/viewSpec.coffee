require '../config'

view = null
user = null

describe 'Tower.View', ->
  beforeEach ->
    view = new Tower.View
    
  describe 'meta tags', ->
    test '#metaTag', ->
      template = ->
        metaTag "description", "A meta tag"
      
      view.render template: template, (error, result) ->
        expect(result).toEqual """
<meta name="description" content="A meta tag" />

"""
  describe 'form', ->
    beforeEach ->
      user = new User(id: 1, firstName: "Lance")
      
    test '#formFor()', ->
      template = ->
        formFor()
      
      view.render template: template, (error, result) ->
        expect(result).toEqual '''
<form role="form" novalidate="true" data-method="post" method="post">
  <input type="hidden" name="_method" value="post" />
</form>

'''
    test '#formFor(user)', ->
      template = ->
        formFor @user, (form) ->
          form.fieldset (fields) ->
            fields.field "firstName"
      
      view.render template: template, locals: user: user, (error, result) ->
        console.log error
        expect(result).toEqual '''
<form class="post">
  <input type="hidden" name="_method" />
  <fieldset>
    <ol class="fields">
      <li>
        <input type="email" />
      </li>
    </ol>
  </fieldset>
</form>

'''
