Tower.Model.Authentication =
  ClassMethods:
    # Like Rails' `has_secure_password`
    authenticated: ->
      @validates 'password', confirmation: true
      @validates 'passwordDigest', presence: true

      # attributes protected by default
      @protected 'passwordDigest'

      @include Tower.Model.Authentication._InstanceMethods

  # Only included if class method is called.
  _InstanceMethods:
    authenticate: (unencryptedPassword) ->
      if require('crypto').bcript(@get('passwordDigest')) == unencryptedPassword
        @
      else
        false

    # Encrypts the password into the passwordDigest attribute.
    setPassword: (unencryptedPassword) ->
      @password = unencryptedPassword
      unless _.isBlank(unencryptedPassword)
        @set 'passwordDigest', require('crypto').bcript(unencryptedPassword)

module.exports = Tower.Model.Authentication
