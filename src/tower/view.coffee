# @include Tower.View.AssetHelper
# @include Tower.View.ComponentHelper
# @include Tower.View.HeadHelper
# @include Tower.View.RenderingHelper
# @include Tower.View.StringHelper
class Tower.View extends Tower.Class
  @reopenClass
    cache:                                      {}
    engine:                                     'coffee'
    prettyPrint:                                false
    loadPaths:                                  ['app/views']
    componentSuffix:                            'widget'
    hintClass:                                  'hint'
    hintTag:                                    'figure'
    labelClass:                                 'control-label'
    requiredClass:                              'required'
    requiredAbbr:                               '*'
    requiredTitle:                              'Required'
    errorClass:                                 'error'
    errorTag:                                   'output'
    validClass:                                 null
    optionalClass:                              'optional'
    optionalAbbr:                               ''
    optionalTitle:                              'Optional'
    labelMethod:                                'humanize'
    labelAttribute:                             'toLabel'
    validationMaxLimit:                         255
    defaultTextFieldSize:                       null
    defaultTextAreaWidth:                       300
    allFieldsRequiredByDefault:                 true
    fieldListTag:                               'ol'
    fieldListClass:                             'fields'
    fieldTag:                                   'li'
    separator:                                  '-'
    breadcrumb:                                 ' - '
    includeBlankForSelectByDefault:             true
    collectionLabelMethods:                     ['toLabel', 'displayName', 'fullName', 'name', 'title', 'toString']
    i18nLookupsByDefault:                       true
    escapeHtmlEntitiesInHintsAndLabels:         false
    renameNestedAttributes:                     true
    inlineValidations:                          true
    autoIdForm:                                 true
    fieldsetClass:                              'fieldset'
    fieldClass:                                 'field control-group'
    validateClass:                              'validate'
    legendClass:                                'legend'
    formClass:                                  'form'
    idEnabledOn:                                ['input', 'field'] # %w(field label error hint)
    widgetsPath:                                'shared/widgets'
    navClass:                                   'list-item'
    includeAria:                                true
    activeClass:                                'active'
    navTag:                                     'li'
    termsTag:                                   'dl'
    termClass:                                  'term'
    termKeyClass:                               'key'
    termValueClass:                             'value'
    hintIsPopup:                                false
    listTag:                                    'ul'
    pageHeaderId:                               'header'
    pageTitleId:                                'title'
    autoIdNav:                                  false
    pageSubtitleId:                             'subtitle'
    widgetClass:                                'widget'
    headerClass:                                'header'
    titleClass:                                 'title'
    subtitleClass:                              'subtitle'
    contentClass:                               'content'
    defaultHeaderLevel:                         3
    termSeparator:                              ':'
    richInput:                                  false
    submitFieldsetClass:                        'submit-fieldset'
    addLabel:                                   '+'
    removeLabel:                                '-'
    cycleFields:                                false
    alwaysIncludeHintTag:                       false
    alwaysIncludeErrorTag:                      true
    requireIfValidatesPresence:                 true
    localizeWithNamespace:                      false
    localizeWithNestedModel:                    false
    localizeWithInheritance:                    true
    defaultComponentHeaderLevel:                3
    helpers:                                    {}
    metaTags: [
      'description',
      'keywords',
      'author',
      'copyright',
      'category',
      'robots'
    ]
    store: (store) ->
      @_store = store if store
      @_store ||= new Tower.Store.Memory(name: 'view')
    renderers: {}
    coffeecupTags: _.map(Tower.modules.coffeecup.tags, (i) -> Tower.Support.String.camelize(i, true))
    helper: (object) ->
      _.extend(Tower.View.helpers, object)

  init: (context = {}) ->
    @_super arguments...
    
    @_context = context

require './view/rendering'
require './view/component'
require './view/table'
require './view/form'
require './view/helpers/assetHelper'
require './view/helpers/componentHelper'
require './view/helpers/elementHelper'
require './view/helpers/emberHelper'
require './view/helpers/headHelper'
require './view/helpers/renderingHelper'
require './view/helpers/stringHelper'

Tower.View.include Tower.View.Rendering
Tower.View.include Tower.View.AssetHelper
Tower.View.include Tower.View.ComponentHelper
Tower.View.include Tower.View.EmberHelper
Tower.View.include Tower.View.HeadHelper
Tower.View.include Tower.View.RenderingHelper
Tower.View.include Tower.View.StringHelper

Tower.View.helper Tower.View.AssetHelper
Tower.View.helper Tower.View.ComponentHelper
Tower.View.helper Tower.View.EmberHelper
Tower.View.helper Tower.View.HeadHelper
Tower.View.helper Tower.View.RenderingHelper
Tower.View.helper Tower.View.StringHelper

module.exports = Tower.View
