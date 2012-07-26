# @todo
# @mixin
Tower.Model.Attachment =
  ClassMethods:
    # For now, you can make a model _and attachment_, 
    # but can't yet have a nested attachment (on the list todo).
    # 
    # @example (Developing currently)
    #   class App.Image extends Tower.Model
    #     @attachment styles: thumb: '25x25'
    # 
    # @example (Eventually)
    #   class App.User extends Tower.Model
    #     @attachment 'photo', styles: thumb: '25x25'
    attachment: (name, options = {}) ->
      if typeof name == 'string'
        # class @Photo extends Tower.Model
        attachmentClassName = _.camelize(name)
        attachmentClass     = @[attachmentClassName] = Tower.Model.extend()
        # add attachment fields to this new class
        attachmentClass._attachmentFields()
        attachmentClass.include(Tower.AttachmentProcessingMixin)
        # then associate it
        @hasOne name, type: attachmentClass
      else # this is the working case, just adds attachment fields to it.
        @_attachmentFields()
        @include Tower.AttachmentProcessingMixin

    _attachmentFields: ->
      @field 'name',        type: 'String'
      @field 'size',        type: 'Integer'
      @field 'width',       type: 'Integer'
      @field 'height',      type: 'Integer'
      @field 'contentType', type: 'String'

    attachments: ->
      @metadata().attachments

  attachments: ->

require './attachment/processing'

module.exports = Tower.Model.Attachment
