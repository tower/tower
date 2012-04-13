Tower.Support.String =
  camelize_rx:    /(?:^|_|\-)(.)/g
  capitalize_rx:  /(^|\s)([a-z])/g
  underscore_rx1: /([A-Z]+)([A-Z][a-z])/g
  underscore_rx2: /([a-z\d])([A-Z])/g

  parameterize: (string) ->
    Tower.Support.String.underscore(string).replace("_", "-")

  constantize: (string, scope = global) ->
    scope[@camelize(string)]

  camelize: (string, firstLetterLower) ->
    string = string.replace @camelize_rx, (str, p1) -> p1.toUpperCase()
    if firstLetterLower then string.substr(0,1).toLowerCase() + string.substr(1) else string

  underscore: (string) ->
    string.replace(@underscore_rx1, '$1_$2')
          .replace(@underscore_rx2, '$1_$2')
          .replace('-', '_').toLowerCase()

  singularize: (string) ->
    len = string.length
    if string.substr(len - 3) is 'ies'
      string.substr(0, len - 3) + 'y'
    else if string.substr(len - 1) is 's'
      string.substr(0, len - 1)
    else
      string

  pluralize: (count, string) ->
    if string
      return string if count is 1
    else
      string = count

    len = string.length
    lastLetter = string.substr(len - 1)
    if lastLetter is 'y'
      "#{string.substr(0, len - 1)}ies"
    else if lastLetter is 's'
      string
    else
      "#{string}s"

  capitalize: (string) -> string.replace @capitalize_rx, (m,p1,p2) -> p1 + p2.toUpperCase()

  trim: (string) -> if string then string.trim() else ""

  interpolate: (stringOrObject, keys) ->
    if typeof stringOrObject is 'object'
      string = stringOrObject[keys.count]
      unless string
        string = stringOrObject['other']
    else
      string = stringOrObject

    for key, value of keys
      string = string.replace(new RegExp("%\\{#{key}\\}", "g"), value)
    string

  grep: (object, regex, iterator, context) ->
    regex = if _.isRegExp(regex) then regex else RegExp(String(regex).replace(/([{.(|}:)$+?=^*!\/[\]\\])/g, "\\$1"))
    found = _.select(object, (s) ->
      regex.test(s)
    , context)
    return _.map(found, iterator, context) if iterator
    found

module.exports = Tower.Support.String

# use single quotes, otherwise they're escaped
Tower.Support.String.toQueryValue = (value, negate = "") ->
  if _.isArray(value)
    items = []
    for item in value
      result  = negate
      result += item
      items.push result
    result = items.join(",")
  else
    result    = negate
    result   += value.toString()

  result = result.replace(" ", "+").replace /[#%\"\|<>]/g, (_) -> encodeURIComponent(_)
  result

# toQuery likes: 10
# toQuery likes: ">=": 10
# toQuery likes: ">=": 10, "<=": 20
# toQuery tags: ["ruby", "javascript"]
# toQuery tags: "!=": ["java", ".net"]
#   #=> tags=-java,-ruby
# toQuery tags: "!=": ["java", ".net"], "==": ["ruby", "javascript"]
#   #=> tags=ruby,javascript,-java,-ruby
Tower.Support.String.toQuery = (object, schema = {}) ->
  result = []

  for key, value of object
    param   = "#{key}="
    type    = schema[key] || "string"
    negate  = if type == "string" then "-" else "^"
    if _.isHash(value)
      data          = {}
      data.min      = value[">="] if value.hasOwnProperty(">=")
      data.min      = value[">"]  if value.hasOwnProperty(">")
      data.max      = value["<="] if value.hasOwnProperty("<=")
      data.max      = value["<"]  if value.hasOwnProperty("<")
      data.match    = value["=~"] if value.hasOwnProperty("=~")
      data.notMatch = value["!~"] if value.hasOwnProperty("!~")
      data.eq       = value["=="] if value.hasOwnProperty("==")
      data.neq      = value["!="] if value.hasOwnProperty("!=")
      data.range    = data.hasOwnProperty("min") || data.hasOwnProperty("max")

      set = []

      if data.range && !(data.hasOwnProperty("eq") || data.hasOwnProperty("match"))
        range = ""

        if data.hasOwnProperty("min")
          range += Tower.Support.String.toQueryValue(data.min)
        else
          range += "n"

        range += ".."

        if data.hasOwnProperty("max")
          range += Tower.Support.String.toQueryValue(data.max)
        else
          range += "n"

        set.push range

      if data.hasOwnProperty("eq")
        set.push Tower.Support.String.toQueryValue(data.eq)
      if data.hasOwnProperty("match")
        set.push Tower.Support.String.toQueryValue(data.match)
      if data.hasOwnProperty("neq")
        set.push Tower.Support.String.toQueryValue(data.neq, negate)
      if data.hasOwnProperty("notMatch")
        set.push Tower.Support.String.toQueryValue(data.notMatch, negate)

      param += set.join(",")
    else
      param += Tower.Support.String.toQueryValue(value)

    result.push param

  result.sort().join("&")

Tower.Support.String.extractDomain = (host, tldLength = 1) ->
  return null unless @namedHost(host)
  parts = host.split('.')
  parts[0..parts.length - 1 - 1 + tldLength].join(".")

Tower.Support.String.extractSubdomains = (host, tldLength = 1) ->
  return [] unless @namedHost(host)
  parts = host.split('.')
  parts[0..-(tldLength+2)]

Tower.Support.String.extractSubdomain = (host, tldLength = 1) ->
  @extractSubdomains(host, tldLength).join('.')

Tower.Support.String.namedHost = (host) ->
  !!!(host == null || /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.exec(host))

Tower.Support.String.rewriteAuthentication = (options) ->
  if options.user && options.password
    "#{encodeURI(options.user)}:#{encodeURI(options.password)}@"
  else
    ""

Tower.Support.String.hostOrSubdomainAndDomain = (options) ->
  return options.host if options.subdomain == null && options.domain == null

  tldLength = options.tldLength || 1

  host = ""
  unless options.subdomain == false
    subdomain = options.subdomain || @extractSubdomain(options.host, tldLength)
    host += "#{subdomain}." if subdomain

  host += (options.domain || @extractDomain(options.host, tldLength))
  host

# urlFor controller: "posts", action: "index"
# urlFor @user
# urlFor User
# urlFor "admin", @user
# Tower._urlFor({onlyPath: true, params: {likes: {">=": -10, "<=": 20, "!=": [13, 15]}, tags: {"==": ["ruby", /javascript /i], "!=": ["java"]}}, trailingSlash: false}, {likes: "integer"})
# "?likes=-10..20,^13,^15&tags=ruby,/javascript+/i,-java"
Tower.Support.String.urlFor = (options) ->
  unless options.host || options.onlyPath
    throw new Error('Missing host to link to! Please provide the :host parameter, set defaultUrlOptions[:host], or set :onlyPath to true')

  result  = ""
  params  = options.params || {}
  path    = (options.path || "").replace(/\/+/, "/")
  schema  = options.schema || {}

  delete options.path
  delete options.schema

  unless options.onlyPath
    port  = options.port
    delete options.port

    unless options.protocol == false
      result += options.protocol || "http"
      result += ":" unless result.match(Tower.Support.RegExp.regexpEscape(":|//"))

    result += "//" unless result.match("//")
    result += @rewriteAuthentication(options)
    result += @hostOrSubdomainAndDomain(options)

    result += ":#{port}" if port

  # params.reject! {|k,v| v.toParam.nil? }

  if options.trailingSlash
    result += path.replace /\/$/, "/"
  else
    result += path

  result += "?#{Tower.Support.String.toQuery(params, schema)}" unless _.isBlank(params)
  result += "##{Tower.Support.String.toQuery(options.anchor)}" if options.anchor
  result

# Tower.urlFor(RW.MongoUser.first(), {onlyPath: false, params: {likes: {">=": -10, "<=": 20, "!=": [13, 15]}, tags: {"==": ["ruby", /javascript#/i], "!=": ["java"]}}, trailingSlash: true, host: "rituwall.com", user: "lance", password: "pollard", anchor: {likes: 10}})
# "http://lance:pollard@rituwall.com/mongo-users/1?likes=-10..20,-13,-15&tags=ruby,/javascript%23/i,-java#likes=10"
Tower.urlFor = ->
  args = _.args(arguments)
  return null unless args[0]
  if args[0] instanceof Tower.Model || (typeof(args[0])).match(/(string|function)/)
    last = args[args.length - 1]
    if last instanceof Tower.Model || (typeof(last)).match(/(string|function)/)
      options = {}
    else
      options = args.pop()

  options ||= args.pop()

  result    = ""

  if options.route
    route = Tower.Route.find(options.route)
    result = route.urlFor() if route
  else if options.controller && options.action
    route   = Tower.Route.find(name: Tower.Support.String.camelize(options.controller).replace(/(Controller)?$/, "Controller"), action: options.action)
    if route
      result  = "/" + Tower.Support.String.parameterize(options.controller)
  else
    for item in args
      result += "/"
      if typeof(item) == "string"
        result += item
      else if item instanceof Tower.Model
        result += item.toPath()
      else if typeof(item) == "function" # need better, b/c i'm meaning constructor here
        result += item.toParam()

  result += switch options.action
    when "new" then "/new"
    when "edit" then "/edit"
    else
      ""

  options.onlyPath = true unless options.hasOwnProperty("onlyPath")
  options.path = result

  Tower.Support.String.urlFor(options)

Tower.Support.String.parameterize = (string) ->
  Tower.Support.String.underscore(string).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "-").replace(/^-+|-+$/g, '')