Tower.Model.Scopes =
  ClassMethods:
    scope: (name, scope) ->
      @[name] = if scope instanceof Tower.Model.Scope then scope else @where(scope)
    
    scoped: ->
      scope = new Tower.Model.Scope(model: @)
      scope.where(type: @name) if @baseClass().name != @name
      scope
      
    defaultSort: (object) ->
      @_defaultSort = object if object
      @_defaultSort

for key in Tower.Model.Scope.scopes
  do (key) ->
    Tower.Model.Scopes.ClassMethods[key] = ->
      @scoped()[key](arguments...)

for key in Tower.Model.Scope.finders
  do (key) ->
    Tower.Model.Scopes.ClassMethods[key] = ->
      @scoped()[key](arguments...)

for key in Tower.Model.Scope.builders
  do (key) ->
    Tower.Model.Scopes.ClassMethods[key] = ->
      @scoped()[key](arguments...)

module.exports = Tower.Model.Scopes
