# @todo
# @module
Tower.Model.Sync =
  sync: ->
    syncAction = @syncAction
    @runCallbacks "sync", =>
      @runCallbacks "#{syncAction}Sync", =>
        @store["#{syncAction}Sync"](@)

  updateSyncAction: (action) ->
    @syncAction = switch action # create, update, delete
      # if it was create, and it's never been synced, then we can just remove it from memory and be all cool
      when "delete" then "delete"

      when "update"
        switch @syncAction
          when "create" then "create"
          else
            "update"
      else
        switch @syncAction
          when "update" then "delete"
          else
            action

module.exports = Tower.Model.Sync
