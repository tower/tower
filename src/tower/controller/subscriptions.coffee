Tower.Controller.Subscriptions =
  ClassMethods:
    subscriptions: ->
      subscriptions = @metadata().subscriptions
      return subscriptions unless arguments.length

      args    = _.flatten(_.args(arguments))
      options = _.extractOptions(args)

      subscriptions.push(key) for key in args

      @

Tower.Controller.Subscriptions.ClassMethods.publish = Tower.Controller.Subscriptions.ClassMethods.subscriptions

module.exports = Tower.Controller.Subscriptions
