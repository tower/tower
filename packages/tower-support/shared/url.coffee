Tower.SupportUrl =
  # use single quotes, otherwise they're escaped
  toQueryValue: (value, type, negate = "") ->
    if _.isArray(value)
      items = []
      for item in value
        result  = negate
        result += item
        items.push result
      result = items.join(",")
    else
      result    = negate
      if type == 'date'
        result   += _(value).strftime('YYYY-MM-DD')
      else
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
  toQuery: (object, schema = {}) ->
    result = []

    for key, value of object
      param   = "#{key}="
      type    = if schema[key] then schema[key].type.toLowerCase() else 'string'
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
          rangeIdentifier = if type == 'date' then 't' else 'n'

          if data.hasOwnProperty("min")
            range += Tower.SupportUrl.toQueryValue(data.min, type)
          else
            range += rangeIdentifier

          range += ".."

          if data.hasOwnProperty("max")
            range += Tower.SupportUrl.toQueryValue(data.max, type)
          else
            range += rangeIdentifier

          set.push range

        if data.hasOwnProperty("eq")
          set.push Tower.SupportUrl.toQueryValue(data.eq, type)
        if data.hasOwnProperty("match")
          set.push Tower.SupportUrl.toQueryValue(data.match, type)
        if data.hasOwnProperty("neq")
          set.push Tower.SupportUrl.toQueryValue(data.neq, type, negate)
        if data.hasOwnProperty("notMatch")
          set.push Tower.SupportUrl.toQueryValue(data.notMatch, type, negate)

        param += set.join(",")
      else
        param += Tower.SupportUrl.toQueryValue(value, type)

      result.push param

    result.sort().join("&")

  extractDomain: (host, tldLength = 1) ->
    return null unless @namedHost(host)
    parts = host.split('.')
    parts[0..parts.length - 1 - 1 + tldLength].join(".")

  extractSubdomains: (host, tldLength = 1) ->
    return [] unless @namedHost(host)
    parts = host.split('.')
    parts[0..-(tldLength+2)]

  extractSubdomain: (host, tldLength = 1) ->
    @extractSubdomains(host, tldLength).join('.')

  namedHost: (host) ->
    !!!(host == null || /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.exec(host))

  rewriteAuthentication: (options) ->
    if options.user && options.password
      "#{encodeURI(options.user)}:#{encodeURI(options.password)}@"
    else
      ""

  hostOrSubdomainAndDomain: (options) ->
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
  urlForBase: (options) ->
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
        result += ":" unless result.match(Tower.SupportRegExp.regexpEscape(":|//"))

      result += "//" unless result.match("//")
      result += @rewriteAuthentication(options)
      result += @hostOrSubdomainAndDomain(options)

      result += ":#{port}" if port

    # params.reject! {|k,v| v.toParam.nil? }

    if options.trailingSlash
      result += path.replace /\/$/, "/"
    else
      result += path

    result += "?#{Tower.SupportUrl.toQuery(params, schema)}" unless _.isBlank(params)
    result += "##{Tower.SupportUrl.toQuery(options.anchor)}" if options.anchor
    result

  # Tower.urlFor(App.User.first(), {onlyPath: false, params: {likes: {">=": -10, "<=": 20, "!=": [13, 15]}, tags: {"==": ["ruby", /javascript#/i], "!=": ["java"]}}, trailingSlash: true, host: "example.com", user: "lance", password: "pollard", anchor: {likes: 10}})
  # "http://lance:pollard@example.com/users/1?likes=-10..20,-13,-15&tags=ruby,/javascript%23/i,-java#likes=10"
  urlFor: ->
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
      route   = Tower.Route.findByControllerOptions(name: Tower.SupportString.camelize(options.controller).replace(/(Controller)?$/, "Controller"), action: options.action)
      if route
        result  = "/" + Tower.SupportString.parameterize(options.controller)
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

    last = args[args.length - 1]
    if last && options.params && !options.schema && last instanceof Tower.Model
      options.schema = last.constructor.fields()

    options.onlyPath = true unless options.hasOwnProperty("onlyPath")
    options.path = result

    @urlForBase(options)

Tower.urlFor = -> Tower.SupportUrl.urlFor arguments...

module.exports = Tower.SupportUrl
