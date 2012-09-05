App.EmailMixin =
  ClassMethods:
    welcome: (id) ->
      App.User.find id, (error, record) =>
        App.Notifier.welcome(record).deliver()
  
  welcome: ->
    @enqueue 'welcome', @get('id')