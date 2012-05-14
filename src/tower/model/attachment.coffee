# @todo
# @mixin
Tower.Model.Attachment =
  ClassMethods:
    # @example
    #   class App.User extends Tower.Model
    #     @attachment 'photo'
    attachment: (name, options = {}) ->
      @field name, ->
        @field 'name'
        @field 'size'
        @field 'path'

    attachments: ->
      @metadata().attachments

  attachments: ->

module.exports = Tower.Model.Attachment
