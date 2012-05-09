App.Concernable.EmailConcern =
  ClassMethods:
    welcome: (id) ->
      App.Concernable.find id, (error, record) =>
        App.Notifier.welcome(record).deliver()
  
  welcome: ->
    @enqueue 'welcome', @get('id')