_ = Tower._

# https://www.ruby-toolbox.com/categories/Active_Record_User_Stamping
# This mixin flags the record with the user id who created/updated/deleted it.
# 
# Mix this with versioning and you have a complete history of who did what to the record over time.
Tower.UserStamps =
  ClassMethods:
    hasUserStamps: false

    # @todo In order to use the thread idea from Rails, 
    #   for global variable access scoped to a request,
    #   need to implement env variable in controller for node.
    # One way to do the above is to pass a `metadata` object to the first record called,
    # then pass that metadata around to every record instantiated then. I think the only records
    # that would touch that record would be scoped to the request (since they're not stored globally).
    # Something like that.
    _hasUserStamper: ->
      @hasUserStamps && false

    userstamps: (options = {}) ->
      metadata = @metadata()

      @hasUserStamps = true

      userstamping  = metadata.userstamping   ||= {}
      type          = userstamping.type         = options.type        || 'User'
      createdBy     = userstamping.createdBy    = options.createdBy   || 'createdBy'
      updatedBy     = userstamping.updatedBy    = options.updatedBy   || 'updatedBy'
      # @todo should methods like this use `deleted` or `destroyed` (need to finalize this convention).
      destroyedBy   = userstamping.destroyedBy  = options.destroyedBy || 'destroyedBy'

      @belongsTo createdBy, type: type
      @belongsTo updatedBy, type: type

      @before 'create', 'setCreatedBy', if: '_hasUserStamper'
      @before 'save', 'setUpdatedBy', if: '_hasUserStamper'

      if @isParanoid
        @belongsTo 'destroyedBy', type: type
        @before 'destroy', 'setDestroyedBy', if: '_hasUserStamper'

  # @protected
  _hasUserStamper: ->
    @constructor._hasUserStamper()

  setCreatedBy: ->
    @set(@constructor.metadata().createdBy, @constructor.userStamper())

  setUpdatedBy: ->
    @set(@constructor.metadata().updatedBy, @constructor.userStamper())

  setDestroyedBy: ->
    @set(@constructor.metadata().destroyedBy, @constructor.userStamper())