Tower.ModelAuthentication =
  ClassMethods:
    # Like Rails' `has_secure_password`
    authenticated: ->
      @field 'passwordDigest'
      @field 'passwordSalt'
      @field 'lastLoginAt', type: 'Date'
      @field 'lastLoginAt', type: 'Date'

      # @validates 'password', confirmation: true
      @validates 'passwordDigest', presence: true

      #@before 'validate', '_setPasswordDigest'

      # attributes protected by default
      @protected 'passwordDigest', 'passwordSalt'

      @include Tower.ModelAuthentication._InstanceMethods

  # Only included if class method is called.
  _InstanceMethods:
    authenticate: (unencryptedPassword, callback) ->
      if @_encryptedPassword(unencryptedPassword) == @get('passwordDigest')
        @updateAttributes({lastLoginAt: new Date}, callback)
        true
      else
        callback.call(@, new Error('Invalid password')) if callback
        false

    _encryptedPassword: (unencryptedPassword) ->
      require('crypto').createHmac('sha1', @get('passwordSalt')).update(unencryptedPassword).digest('hex')

    _generatePasswordSalt: ->
      Math.round((new Date().valueOf() * Math.random())).toString()

    _setPasswordDigest: (password) ->
      password ||= @get('password')

      if password
        @set('passwordSalt', @_generatePasswordSalt())
        @set('passwordDigest', @_encryptedPassword(password))

      true

module.exports = Tower.ModelAuthentication
