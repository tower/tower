# @todo remove
try
  coffeecupTags = if Tower.isServer then _.map(Tower.module('coffeecup').tags, (i) -> _.camelize(i, true)) else []
catch error
  coffeecupTags = []

# @include Tower.ViewAssetHelper
# @include Tower.ViewComponentHelper
# @include Tower.ViewHeadHelper
# @include Tower.ViewRenderingHelper
# @include Tower.ViewStringHelper
# 
# @todo I think we can remove the view class.
class Tower.View extends Tower.Class
  @reopenClass
    cache:                                      {}
    engine:                                     'coffee'
    prettyPrint:                                false
    loadPaths:                                  ['app/templates']
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
      @_store ||= new Tower.StoreMemory(name: 'view')
    renderers: {}
    coffeecupTags: coffeecupTags
    helper: (object) ->
      _.extend(Tower.View.helpers, object)

  @reopen
    init: (context = {}) ->
      @_super arguments...

      @_context = context

module.exports = Tower.View
