class Tower.View extends Tower.Class
  @extend
    engine:                                     "coffee"
    prettyPrint:                                false
    loadPaths:                                  ["app/views"]
    componentSuffix:                            "widget"
    hintClass:                                  "hint"
    hintTag:                                    "figure"
    labelClass:                                 "label"
    requiredClass:                              "required"
    requiredAbbr:                               "*"
    requiredTitle:                              "Required"
    errorClass:                                 "error"
    errorTag:                                   "output"
    validClass:                                 null
    optionalClass:                              "optional"
    optionalAbbr:                               ""
    optionalTitle:                              "Optional"
    labelMethod:                                "humanize"
    labelAttribute:                             "toLabel"
    validationMaxLimit:                         255
    defaultTextFieldSize:                       null
    defaultTextAreaWidth:                       300
    allFieldsRequiredByDefault:                 true
    fieldListTag:                               "ol"
    fieldListClass:                             "fields"
    fieldTag:                                   "li"
    separator:                                  "-"
    breadcrumb:                                 " - "
    includeBlankForSelectByDefault:             true
    collectionLabelMethods:                     ["toLabel", "displayName", "fullName", "name", "title", "toString"]
    i18nLookupsByDefault:                       true
    escapeHtmlEntitiesInHintsAndLabels:         false
    renameNestedAttributes:                     true
    inlineValidations:                          true
    autoIdForm:                                 true
    fieldsetClass:                              "fieldset"
    fieldClass:                                 "field"
    validateClass:                              "validate"
    legendClass:                                "legend"
    formClass:                                  "form"
    idEnabledOn:                                ["input", "field"] # %w(field label error hint)
    widgetsPath:                                "shared/widgets"
    navClass:                                   "list-item"
    includeAria:                                true
    activeClass:                                "active"
    navTag:                                     "li"
    termsTag:                                   "dl"
    termClass:                                  "term"
    termKeyClass:                               "key"
    termValueClass:                             "value"
    hintIsPopup:                                false
    listTag:                                    "ul"
    pageHeaderId:                               "header"
    pageTitleId:                                "title"
    autoIdNav:                                  false
    pageSubtitleId:                             "subtitle"
    widgetClass:                                "widget"
    headerClass:                                "header"
    titleClass:                                 "title"
    subtitleClass:                              "subtitle"
    contentClass:                               "content"
    defaultHeaderLevel:                         3
    termSeparator:                              ":"
    richInput:                                  false
    submitFieldsetClass:                        "submit-fieldset"
    addLabel:                                   "+"
    removeLabel:                                "-"
    cycleFields:                                false
    alwaysIncludeHintTag:                       false
    alwaysIncludeErrorTag:                      true
    requireIfValidatesPresence:                 true
    localizeWithNamespace:                      false
    localizeWithNestedModel:                    false
    localizeWithInheritance:                    true
    defaultComponentHeaderLevel:                3
    metaTags: [
      "description",
      "keywords",
      "author",
      "copyright",
      "category",
      "robots"
    ]
    store: (store) ->
      @_store = store if store
      @_store ||= new Tower.Store.Memory(name: "view")
  
  constructor: (context = {}) ->
    @_context = context

require './view/helpers'
require './view/rendering'
require './view/component'
require './view/table'
require './view/form'
require './view/helpers/assetHelper'
require './view/helpers/componentHelper'
require './view/helpers/dateHelper'
require './view/helpers/elementHelper'
require './view/helpers/headHelper'
require './view/helpers/numberHelper'
require './view/helpers/renderingHelper'
require './view/helpers/stringHelper'

Tower.View.include Tower.View.Rendering
Tower.View.include Tower.View.Helpers
Tower.View.include Tower.View.AssetHelper
Tower.View.include Tower.View.ComponentHelper
Tower.View.include Tower.View.DateHelper
Tower.View.include Tower.View.HeadHelper
Tower.View.include Tower.View.NumberHelper
Tower.View.include Tower.View.RenderingHelper
Tower.View.include Tower.View.StringHelper

module.exports = Tower.View
