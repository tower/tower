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
    attachment: (name, options) ->
      if typeof name == 'string'
        options ||= {}
        # class @Photo extends Tower.Model
        attachmentClassName = _.camelize(name)
        attachmentClass     = @[attachmentClassName] = Tower.Model.extend()
        # add attachment fields to this new class
        attachmentClass._attachmentFields()
        attachmentClass._attachmentProcessing(options)
        # then associate it
        @hasOne name, type: attachmentClass
      else # this is the working case, just adds attachment fields to it.
        options = name
        options ||= {}
        @_attachmentFields()
        @_attachmentProcessing(options)

    # @todo
    attachments: ->
      @metadata().attachments

    # @private
    _attachmentFields: ->
      @field 'name',        type: 'String'
      @field 'size',        type: 'Integer'
      @field 'width',       type: 'Integer'
      @field 'height',      type: 'Integer'
      @field 'contentType', type: 'String'

    # @private
    _attachmentProcessing: (options) ->
      @include Tower.AttachmentProcessingMixin

      @styles options.styles if options.styles

require './attachment/processing'

module.exports = Tower.Model.Attachment
