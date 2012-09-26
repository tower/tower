var coffeecupTags,
  __hasProp = {}.hasOwnProperty,
  __extends =   function(child, parent) {
    if (typeof parent.__extend == 'function') return parent.__extend(child);
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; 
    if (typeof parent.extended == 'function') parent.extended(child); 
    return child; 
};

try {
  coffeecupTags = Tower.isServer ? _.map(Tower.module('coffeecup').tags, function(i) {
    return _.camelize(i, true);
  }) : [];
} catch (error) {
  coffeecupTags = [];
}

Tower.View = (function(_super) {
  var View;

  function View() {
    return View.__super__.constructor.apply(this, arguments);
  }

  View = __extends(View, _super);

  View.reopenClass({
    cache: {},
    engine: 'coffee',
    prettyPrint: false,
    loadPaths: ['app/templates'],
    componentSuffix: 'widget',
    hintClass: 'hint',
    hintTag: 'figure',
    labelClass: 'control-label',
    requiredClass: 'required',
    requiredAbbr: '*',
    requiredTitle: 'Required',
    errorClass: 'error',
    errorTag: 'output',
    validClass: null,
    optionalClass: 'optional',
    optionalAbbr: '',
    optionalTitle: 'Optional',
    labelMethod: 'humanize',
    labelAttribute: 'toLabel',
    validationMaxLimit: 255,
    defaultTextFieldSize: null,
    defaultTextAreaWidth: 300,
    allFieldsRequiredByDefault: true,
    fieldListTag: 'ol',
    fieldListClass: 'fields',
    fieldTag: 'li',
    separator: '-',
    breadcrumb: ' - ',
    includeBlankForSelectByDefault: true,
    collectionLabelMethods: ['toLabel', 'displayName', 'fullName', 'name', 'title', 'toString'],
    i18nLookupsByDefault: true,
    escapeHtmlEntitiesInHintsAndLabels: false,
    renameNestedAttributes: true,
    inlineValidations: true,
    autoIdForm: true,
    fieldsetClass: 'fieldset',
    fieldClass: 'field control-group',
    validateClass: 'validate',
    legendClass: 'legend',
    formClass: 'form',
    idEnabledOn: ['input', 'field'],
    widgetsPath: 'shared/widgets',
    navClass: 'list-item',
    includeAria: true,
    activeClass: 'active',
    navTag: 'li',
    termsTag: 'dl',
    termClass: 'term',
    termKeyClass: 'key',
    termValueClass: 'value',
    hintIsPopup: false,
    listTag: 'ul',
    pageHeaderId: 'header',
    pageTitleId: 'title',
    autoIdNav: false,
    pageSubtitleId: 'subtitle',
    widgetClass: 'widget',
    headerClass: 'header',
    titleClass: 'title',
    subtitleClass: 'subtitle',
    contentClass: 'content',
    defaultHeaderLevel: 3,
    termSeparator: ':',
    richInput: false,
    submitFieldsetClass: 'submit-fieldset',
    addLabel: '+',
    removeLabel: '-',
    cycleFields: false,
    alwaysIncludeHintTag: false,
    alwaysIncludeErrorTag: true,
    requireIfValidatesPresence: true,
    localizeWithNamespace: false,
    localizeWithNestedModel: false,
    localizeWithInheritance: true,
    defaultComponentHeaderLevel: 3,
    helpers: {},
    metaTags: ['description', 'keywords', 'author', 'copyright', 'category', 'robots'],
    store: function(store) {
      if (store) {
        this._store = store;
      }
      return this._store || (this._store = new Tower.StoreMemory({
        name: 'view'
      }));
    },
    renderers: {},
    coffeecupTags: coffeecupTags,
    helper: function(object) {
      return _.extend(Tower.View.helpers, object);
    }
  });

  View.reopen({
    init: function(context) {
      if (context == null) {
        context = {};
      }
      this._super.apply(this, arguments);
      return this._context = context;
    }
  });

  return View;

})(Tower.Class);

module.exports = Tower.View;
