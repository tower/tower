_ = Tower._

# @mixin
# @todo
# https://github.com/technoweenie/coffee-resque
Tower.ModelQueue =
  ClassMethods:
    # @example Send email using job queue
    #   class App.User extends Tower.Model
    #     @welcome: (conditions) ->
    #       App.User.where(conditions).all (error, users) =>
    #         for user in users
    #           App.UserMailer.welcome(user).deliver()
    #
    #     welcome: (callback) ->
    #       @enqueue 'welcome', @get('id'), => @reload(callback)
    #       # or pass in hash
    #       # @enqueue method: 'welcome', args: [@get('id')], complete: ->
    #
    #   App.User.first (error, user) =>
    #     user.welcome()
    # 
    # delay, attempts, method, args, priority
    # 
    # @example Showing image thumbnail generation progress
    #   # say you have 3 thumbnails and want to do a countdown (4 to 1)
    #   class App.Image extends Tower.Model
    #     @processFiles: (id, callback) =>
    #       # some processing logic
    #       callback.call(@) if callback
    #     
    #     processFiles: (callback) ->
    #       self = @
    # 
    #       progressCallback = (progress) ->
    #         job = @
    #         console.log "processed #{progress}%"
    # 
    #       completeCallback = ->
    #         job = @
    #         callback.call(self, null, job) if callback
    # 
    #       @enqueue('processFiles', @get('id'))
    #         .on('progress', progressCallback)
    #         .on('complete', completeCallback)
    enqueue: ->
      args      = _.args(arguments)
      options   = args.shift()

      unless typeof options == 'object'
        method    = options
        options   = {}
      else
        # method  = args.shift()
        method    = options.method
        args      = options.args

      callback    = options.complete || _.extractBlock(args) # check if last arg is callback, because it can't be passed to job as JSON

      klass = @className()
      # @todo robustify
      jobs  = Tower.queue ||= Tower.module('kue').createQueue()
      queue = options.queue || (_.camelize(klass) + '.' + method) # queue name is "User.welcome", or "Class.method"

      # we make a flag if a callback was passed, so we know to call the method with a callback
      job = jobs.create(queue, klass: klass, method: method, args: args, async: !!callback)
      job.delay(options.delay) if options.delay?
      job.priority(options.priority) if options.priority?
      job.attempts(options.attempts) if options.attempts?

      # job.on 'progress', (percent) -> console.log('job', @id, percent)
      # to update the job, pass in job.progress(completed, total), and that will call
      # this function with the calculated percent.
      job.on 'progress', options.progress if options.progress
      
      job.on 'failed', =>
        message = 'Job failed'
        if callback
          callback.call(job, new Error(message))
        else
          console.log(message, job)

      job.on 'complete', =>
        callback.call(job, null) if callback

      job.save() # returned, so you can access the raw job if you want

  # Only pass JSON-serializable arguments (strings, numbers, simple objects and arrays, null, dates, no functions/regexps)
  # You can pass a complete callback though.
  enqueue: ->
    @constructor.enqueue arguments...

module.exports = Tower.ModelQueue
