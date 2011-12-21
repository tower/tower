Tower.Mailer.Rendering =  
  ClassMethods:    
    mail: (options = {}, callback) ->
      @host     = options.host
      @port     = options.port
      @domain   = options.domain
      @to       = options.to
      @from     = options.from
      @subject  = options.subject
      @locals   = options.locals || {}
      @template = options.template
  
  deliver: ->
    email = @constructor.lib()
    self  = @
    
    Shift.render path: @template, @locals, (error, body) ->
      options =
        host:           self.host
        port:           self.port
        domain:         self.domain
        to:             self.to
        from:           self.from
        subject:        self.subject
        body:           body  
        authentication: self.login
        username:       self.username
        password:       self.password

      email.send options, (error, result) ->
        console.log error if error
        console.log result

module.exports = Tower.Mailer.Rendering
