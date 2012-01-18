class <%= project.className %>.<%= model.pluralClassName %>Controller extends Tower.Controller<% for (var i = 0; i < model.attributes.length; i++) { %>
  @param "<%= model.attributes[i].name %>"<% } %>
  
  new: ->
    @<%= model.name %> = new <%= project.className %>.<%= model.className %>
    
    @respondWith @<%= model.name %>, (format) =>
      format.json => @render json: @<%= model.name %>
  
  create: ->
    @_create (success, failure) =>
      success.json => @render json: @resource
      failure.json => @render status: 404