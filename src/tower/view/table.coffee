class Tower.View.Table extends Tower.View.Component
  constructor: (args, options) ->
    super

    recordOrKey       = args.shift()
    @key              = @recordKey(recordOrKey)
    @rowIndex         = 0
    @cellIndex        = 0
    @scope            = "table"
    @headers          = []

    options.summary ||= "Table for #{_.titleize(@key)}"
    #options.class     = ["data-table", options.class].compact.uniq.join(" ")
    options.role      = "grid"
    options.class     = @addClass(options.class || "", ["table"])

    data              = options.data ||= {}

    #data.url        = options.url || @template.controller.request.path
    #data.for        = options.for || options.model || @key
    data.total        = options.total if options.hasOwnProperty("total")
    data.page         = options.page  if options.hasOwnProperty("page")
    data.count        = options.count if options.hasOwnProperty("count")

    aria              = options.aria || {}
    delete options.aria

    aria["aria-multiselectable"] = false unless aria.hasOwnProperty("aria-multiselectable") || options.multiselect == true

    options.id      ||= "#{recordOrKey}-table"

    @options =
      summary:  options.summary
      role:     options.role
      data:     options.data
      class:    options.class

  render: (block) ->
    @tag "table", @options, =>
      block(@) if block
      null

  tableQueryRowClass: ->
    ["search-row", if queryParams.except("page", "sort").blank? then null else "search-results"].compact.join(" ")

  linkToSort: (title, attribute, options = {}) ->
    sortParam = sortValue(attribute, oppositeSortDirection(attribute))
    linkTo title, withParams(request.path, sort: sortParam), options

  nextPagePath: (collection) ->
    withParams(request.path, page: collection.nextPage)

  prevPagePath: (collection) ->
    withParams(request.path, page: collection.prevPage)

  firstPagePath: (collection) ->
    withParams(request.path, page: 1)

  lastPagePath: (collection) ->
    withParams(request.path, page: collection.lastPage)

  currentPageNum: ->
    page = if params.page then params.page else 1
    page = 1 if page < 1
    page

  caption: ->

  # scope='col'
  head: (attributes = {}, block) ->
    @hideHeader = attributes.visible == false
    delete attributes.visible

    @_section "head", attributes, block

  # scope='row'
  # <td headers='x'/>
  body: (attributes = {}, block) ->
    @_section "body", attributes, block

  foot: (attributes = {}, block) ->
    @_section "foot", attributes, block

  _section: (scope, attributes, block) ->
    @rowIndex   = 0
    @scope      = scope

    @tag "t#{scope}", attributes, block

    @rowIndex   = 0
    @scope      = "table"

  row: (args..., block) ->
    attributes = Tower.Support.Array.extractOptions(args)

    attributes.scope = "row"

    if @scope == "body"
      #attributes.class = [template.cycle("odd", "even"), attributes.class].compact.uniq.join(" ")
      attributes.role = "row"

    @rowIndex += 1
    @cellIndex = 0

    @tag "tr", attributes, block

    @cellIndex = 0

  column: (args..., block) ->
    attributes        = Tower.Support.Array.extractOptions(args)
    value             = args.shift()

    attributes.id   ||= @idFor("header", key, value, @rowIndex, @cellIndex) if Tower.View.idEnabledOn.include?("table")

    attributes.width  = @pixelate(attributes.width) if attributes.hasOwnProperty("width")
    attributes.height = @pixelate(attributes.height) if attributes.hasOwnProperty("height")

    @headers.push attributes.id

    tag "col", attributes

    @cellIndex += 1

  # direction => "ascending"
  # valid directions: ascending, descending, none, other
  # abbr is what the header controls (for sorting)
  header: ->
    args              = Tower.Support.Array.args(arguments)
    block             = Tower.Support.Array.extractBlock(args)
    attributes        = Tower.Support.Array.extractOptions(args)
    value             = args.shift()

    attributes.abbr ||= value
    attributes.role   = "columnheader"
    attributes.id   ||= @idFor("header", key, value, @rowIndex, @cellIndex) if Tower.View.idEnabledOn.include?("table")
    attributes.scope = "col"
    attributes.abbr ||= attributes.for if attributes.hasOwnProperty("for")
    attributes.abbr ||= value

    delete attributes.for

    attributes.width  = @pixelate(attributes.width) if attributes.hasOwnProperty("width")
    attributes.height = @pixelate(attributes.height) if attributes.hasOwnProperty("height")

    sort = attributes.sort == true
    delete attributes.sort

    if sort
      attributes.class        = @addClass attributes.class || "", [attributes.sortClass || "sortable"]
      attributes.direction  ||= "asc"#@template.sortClass(value)

    delete attributes.sortClass

    label = attributes.label || _.titleize(value.toString())
    delete attributes.label

    direction = attributes.direction
    delete attributes.direction

    if direction
      attributes["aria-sort"] = direction
      attributes.class = [attributes.class, direction].join(" ")
      attributes["aria-selected"] = true
    else
      attributes["aria-sort"] = "none"
      attributes["aria-selected"] = false

    @headers.push(attributes.id)

    if block
      @tag "th", attributes, block
    else
      if sort
        @tag "th", attributes, =>
          @linkToSort(label, value)
      else
        @tag "th", attributes, =>
          @tag "span", label

    @cellIndex += 1

  linkToSort: (label, value) ->
    direction = "+"
    @tag "a", href: "?sort=#{direction}", =>
      @tag "span", label

  cell: (args..., block) ->
    attributes        = Tower.Support.Array.extractOptions(args)
    value             = args.shift()

    attributes.role   = "gridcell"
    attributes.id   ||= @idFor("cell", key, value, @rowIndex, @cellIndex) if Tower.View.idEnabledOn.include?("table")

    #attributes[:"aria-describedby"] = @headers[@cellIndex]
    attributes.headers            = @headers[@cellIndex]

    attributes.width  = @pixelate(attributes.width) if attributes.hasOwnProperty("width")
    attributes.height = @pixelate(attributes.height) if attributes.hasOwnProperty("height")

    if block
      @tag "td", attributes, block
    else
      @tag "td", value, attributes

    @cellIndex                     += 1

  recordKey: (recordOrKey) ->
    if typeof recordOrKey == "string"
      recordOrKey
    else
      recordOrKey.constructor.name

  idFor: (type, key, value, row_index = @row_index, column_index = @column_index) ->
    [key, type, row_index, column_index].compact.map (node) ->
      node.replace(/[\s_]/, "-")
    end.join("-")

  pixelate: (value) ->
    if typeof value == "string" then value else "#{value}px"
