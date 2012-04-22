Tower.Model.Attachment =
  ClassMethod:
    # @example
    #   @attachment "photo"
    attachment: (name, options = {}) ->
      @field name, ->
        @field "name"
        @field "size"
        @field "path"
      
    attachments: ->
      @metadata().attachments
      
  attachments: ->
      
module.exports = Tower.Model.Attachment
