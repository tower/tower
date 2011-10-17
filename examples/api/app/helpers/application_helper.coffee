class ApplicationHelper
  t: (string) ->
    @_t ?= require("#{Metro.root}/config/locales/en")
    @_t[string]
  