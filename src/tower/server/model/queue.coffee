# @mixin
# @todo
# https://github.com/technoweenie/coffee-resque
Tower.Model.Queue =
  ClassMethods:
    # @example Send email using job queue
    #   class App.User extends Tower.Model
    #     @welcome: (conditions) ->
    #       App.User.where(conditions).all (error, users) =>
    #         for user in users
    #           App.UserMailer.welcome(user).deliver()
    #
    #     welcome: ->
    #       @enqueue 'welcome', @get('id')
    #
    #   App.User.first (error, user) =>
    #     user.welcome()
    enqueue: ->
      args      = _.args(arguments)
      options   = args.shift()

      unless typeof options == 'object'
        method  = options
        options = {}
      else
        method  = args.shift()

      klass = @className()
      kue   = Tower.modules.kue
      jobs  = kue.createQueue()
      queue = options.queue || _.parameterize(klass)

      jobs.create(queue, klass: klass, method: method, args: args).save()

  enqueue: ->
    @constructor.enqueue arguments...

module.exports = Tower.Model.Queue
