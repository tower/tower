var __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.View = (function(_super) {

  __extends(View, _super);

  View.extend({
    cache: {},
    engine: "coffee",
    prettyPrint: false,
    loadPaths: ["app/views"],
    componentSuffix: "widget",
    hintClass: "hint",
    hintTag: "figure",
    labelClass: "control-label",
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
    fieldClass: "field control-group",
    validateClass: "validate",
    legendClass: "legend",
    formClass: "form",
    idEnabledOn: ["input", "field"],
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
    helpers: [],
    metaTags: ["description", "keywords", "author", "copyright", "category", "robots"],
    store: function(store) {
      if (store) this._store = store;
      return this._store || (this._store = new Tower.Store.Memory({
        name: "view"
      }));
    },
    renderers: {}
  });

  function View(context) {
    if (context == null) context = {};
    this._context = context;
  }

  return View;

})(Tower.Class);

require('./view/helpers');

require('./view/rendering');

require('./view/component');

require('./view/table');

require('./view/form');

require('./view/helpers/assetHelper');

require('./view/helpers/componentHelper');

require('./view/helpers/elementHelper');

require('./view/helpers/headHelper');

require('./view/helpers/renderingHelper');

require('./view/helpers/stringHelper');

Tower.View.include(Tower.View.Rendering);

Tower.View.include(Tower.View.Helpers);

Tower.View.include(Tower.View.AssetHelper);

Tower.View.include(Tower.View.ComponentHelper);

Tower.View.include(Tower.View.HeadHelper);

Tower.View.include(Tower.View.RenderingHelper);

Tower.View.include(Tower.View.StringHelper);

Tower.View.helpers.push(Tower.View.AssetHelper);

Tower.View.helpers.push(Tower.View.ComponentHelper);

Tower.View.helpers.push(Tower.View.HeadHelper);

Tower.View.helpers.push(Tower.View.RenderingHelper);

Tower.View.helpers.push(Tower.View.StringHelper);

module.exports = Tower.View;
