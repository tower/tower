class <%= project.className %>.<%= model.pluralClassName %>Controller extends <%= project.className %>.ApplicationController<% for (var i = 0; i < model.attributes.length; i++) { %>
  @param "<%= model.attributes[i].name %>"<% } %>
###
  index: ->
    <%= project.className %>.<%= model.className %>.where(@criteria()).all (error, collection) =>
      @render "index"
    
  new: ->
    resource = new <%= project.className %>.<%= model.className %>
    @render "new"
    
  create: ->
    <%= project.className %>.<%= model.className %>.create @params.<%= model.name %>, (error, resource) =>
      if error
        @redirectTo "new"
      else
        @redirectTo @urlFor(resource)
    
  show:  ->
    <%= project.className %>.<%= model.className %>.find @params.id, (error, resource) =>
      if resource
        @render "show"
      else
        @redirectTo "index"
    
  edit: ->
    <%= project.className %>.<%= model.className %>.find @params.id, (error, resource) =>
      if resource
        @render "edit"
      else
        @redirectTo "index"
      
  update: ->
    <%= project.className %>.<%= model.className %>.find @params.id (error, resource) =>
      if error
        @redirectTo "edit"
      else
        resource.updateAttributes @params.<%= model.name %>, (error) =>
          @redirectTo @urlFor(resource)
    
  destroy: ->
    <%= project.className %>.<%= model.className %>.find @params.id, (error, resource) =>
      if error
        @redirectTo "index"
      else
        resource.destroy (error) =>
          @redirectTo "index"
    
###
