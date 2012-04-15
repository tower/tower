Tower.Model.Attachment =
  ClassMethod:
    # @example
    #   @attachment "photo"
    attachment: (name, options = {}) ->
      
    attachments: ->
      @metadata().attachments
      
module.exports = Tower.Model.Attachment
