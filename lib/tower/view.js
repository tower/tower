var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.View = (function() {

  __extends(View, Tower.Class);

  View.extend({
    engine: "coffee",
    prettyPrint: false,
    loadPaths: ["app/views"],
    componentSuffix: "widget",
    hintClass: "hint",
    hintTag: "figure",
    labelClass: "label",
    requiredClass: "required",
    requiredAbbr: "*",
    requiredTitle: "Required",
    errorClass: "error",
    errorTag: "output",
    validClass: null,
    optionalClass: "optional",
    optionalAbbr: "",
    optionalTitle: "Optional",
    labelMethod: "humanize",
    labelAttribute: "toLabel",
    validationMaxLimit: 255,
    defaultTextFieldSize: null,
    defaultTextAreaWidth: 300,
    allFieldsRequiredByDefault: true,
    fieldListTag: "ol",
    fieldListClass: "fields",
    fieldTag: "li",
    separator: "-",
    breadcrumb: " - ",
    includeBlankForSelectByDefault: true,
    collectionLabelMethods: ["toLabel", "displayName", "fullName", "name", "title", "toString"],
    i18nLookupsByDefault: true,
    escapeHtmlEntitiesInHintsAndLabels: false,
    renameNestedAttributes: true,
    inlineValidations: true,
    autoIdForm: true,
    fieldsetClass: "fieldset",
    fieldClass: "field",
    validateClass: "validate",
    legendClass: "legend",
    formClass: "form",
    idEnabledOn: ["input"],
    widgetsPath: "shared/widgets",
    navClass: "list-item",
    includeAria: true,
    activeClass: "active",
    navTag: "li",
    termsTag: "dl",
    termClass: "term",
    termKeyClass: "key",
    termValueClass: "value",
    hintIsPopup: false,
    listTag: "ul",
    pageHeaderId: "header",
    pageTitleId: "title",
    autoIdNav: false,
    pageSubtitleId: "subtitle",
    widgetClass: "widget",
    headerClass: "header",
    titleClass: "title",
    subtitleClass: "subtitle",
    contentClass: "content",
    defaultHeaderLevel: 3,
    termSeparator: ":",
    richInput: false,
    submitFieldsetClass: "submit-fieldset",
    addLabel: "+",
    removeLabel: "-",
    cycleFields: false,
    alwaysIncludeHintTag: false,
    alwaysIncludeErrorTag: true,
    requireIfValidatesPresence: true,
    localizeWithNamespace: false,
    localizeWithNestedModel: false,
    localizeWithInheritance: true,
    defaultComponentHeaderLevel: 3,
    metaTags: ["description", "keywords", "author", "copyright", "category", "robots"],
    store: function(store) {
      if (store) this._store = store;
      return this._store || (this._store = new Tower.Store.Memory({
        name: "view"
      }));
    }
  });

  function View(context) {
    if (context == null) context = {};
    this._context = context;
  }

  return View;

})();

require('./view/helpers');

require('./view/rendering');

require('./view/component');

require('./view/table');

require('./view/form');

require('./view/helpers/assetHelper');

require('./view/helpers/componentHelper');

require('./view/helpers/dateHelper');

require('./view/helpers/elementHelper');

require('./view/helpers/headHelper');

require('./view/helpers/numberHelper');

require('./view/helpers/renderingHelper');

require('./view/helpers/stringHelper');

Tower.View.include(Tower.View.Rendering);

Tower.View.include(Tower.View.Helpers);

Tower.View.include(Tower.View.AssetHelper);

Tower.View.include(Tower.View.ComponentHelper);

Tower.View.include(Tower.View.DateHelper);

Tower.View.include(Tower.View.HeadHelper);

Tower.View.include(Tower.View.NumberHelper);

Tower.View.include(Tower.View.RenderingHelper);

Tower.View.include(Tower.View.StringHelper);

module.exports = Tower.View;
