class <%= controller.namespace %>.<%= controller.className %> extends <%= app.namespace %>.ApplicationController<% for (var i = 0; i < model.attributes.length; i++) { %>
  @param '<%= model.attributes[i].name %>'<% } %>

  @scope 'all'
###
  index: ->
    <%= app.namespace %>.<%= model.className %>.where(@criteria()).all (error, collection) =>
      @render "index"

  new: ->
    resource = new <%= app.namespace %>.<%= model.className %>
    @render "new"

  create: ->
    <%= app.namespace %>.<%= model.className %>.create @params.<%= model.name %>, (error, resource) =>
      if error
        @redirectTo "new"
      else
        @redirectTo @urlFor(resource)

  show:  ->
    <%= app.namespace %>.<%= model.className %>.find @params.id, (error, resource) =>
      if resource
        @render "show"
      else
        @redirectTo "index"

  edit: ->
    <%= app.namespace %>.<%= model.className %>.find @params.id, (error, resource) =>
      if resource
        @render "edit"
      else
        @redirectTo "index"

  update: ->
    <%= app.namespace %>.<%= model.className %>.find @params.id (error, resource) =>
      if error
        @redirectTo "edit"
      else
        resource.updateAttributes @params.<%= model.name %>, (error) =>
          @redirectTo @urlFor(resource)

  destroy: ->
    <%= app.namespace %>.<%= model.className %>.find @params.id, (error, resource) =>
      if error
        @redirectTo "index"
      else
        resource.destroy (error) =>
          @redirectTo "index"

###
