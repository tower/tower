# @mixin
Tower.ControllerAuthentication =
  ClassMethods:
    # @example
    #   authenticated name: "Lance", password: "Pollard", only: "search"
    authenticated: (options = {}) ->
