var __defineProperty = function(clazz, key, value) {
  if (typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
},
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
},
  __slice = [].slice;

Tower.ViewTable = (function(_super) {
  var ViewTable;

  ViewTable = __extends(ViewTable, _super);

  function ViewTable(args, options) {
    var aria, data, recordOrKey;
    ViewTable.__super__.constructor.apply(this, arguments);
    recordOrKey = args.shift();
    this.key = this.recordKey(recordOrKey);
    this.rowIndex = 0;
    this.cellIndex = 0;
    this.scope = "table";
    this.headers = [];
    options.summary || (options.summary = "Table for " + (_.titleize(this.key)));
    options.role = "grid";
    options["class"] = this.addClass(options["class"] || "", ["table"]);
    data = options.data || (options.data = {});
    if (options.hasOwnProperty("total")) {
      data.total = options.total;
    }
    if (options.hasOwnProperty("page")) {
      data.page = options.page;
    }
    if (options.hasOwnProperty("count")) {
      data.count = options.count;
    }
    aria = options.aria || {};
    delete options.aria;
    if (!(aria.hasOwnProperty("aria-multiselectable") || options.multiselect === true)) {
      aria["aria-multiselectable"] = false;
    }
    options.id || (options.id = "" + recordOrKey + "-table");
    this.options = {
      summary: options.summary,
      role: options.role,
      data: options.data,
      "class": options["class"]
    };
  }

  __defineProperty(ViewTable,  "render", function(block) {
    var _this = this;
    return this.tag("table", this.options, function() {
      if (block) {
        block(_this);
      }
      return null;
    });
  });

  __defineProperty(ViewTable,  "tableQueryRowClass", function() {
    return ["search-row", queryParams.except("page", "sort").blank != null ? null : "search-results"].compact.join(" ");
  });

  __defineProperty(ViewTable,  "linkToSort", function(title, attribute, options) {
    var sortParam;
    if (options == null) {
      options = {};
    }
    sortParam = sortValue(attribute, oppositeSortDirection(attribute));
    return linkTo(title, withParams(request.path, {
      sort: sortParam
    }), options);
  });

  __defineProperty(ViewTable,  "nextPagePath", function(collection) {
    return withParams(request.path, {
      page: collection.nextPage
    });
  });

  __defineProperty(ViewTable,  "prevPagePath", function(collection) {
    return withParams(request.path, {
      page: collection.prevPage
    });
  });

  __defineProperty(ViewTable,  "firstPagePath", function(collection) {
    return withParams(request.path, {
      page: 1
    });
  });

  __defineProperty(ViewTable,  "lastPagePath", function(collection) {
    return withParams(request.path, {
      page: collection.lastPage
    });
  });

  __defineProperty(ViewTable,  "currentPageNum", function() {
    var page;
    page = params.page ? params.page : 1;
    if (page < 1) {
      page = 1;
    }
    return page;
  });

  __defineProperty(ViewTable,  "caption", function() {});

  __defineProperty(ViewTable,  "head", function(attributes, block) {
    if (attributes == null) {
      attributes = {};
    }
    this.hideHeader = attributes.visible === false;
    delete attributes.visible;
    return this._section("head", attributes, block);
  });

  __defineProperty(ViewTable,  "body", function(attributes, block) {
    if (attributes == null) {
      attributes = {};
    }
    return this._section("body", attributes, block);
  });

  __defineProperty(ViewTable,  "foot", function(attributes, block) {
    if (attributes == null) {
      attributes = {};
    }
    return this._section("foot", attributes, block);
  });

  __defineProperty(ViewTable,  "_section", function(scope, attributes, block) {
    this.rowIndex = 0;
    this.scope = scope;
    this.tag("t" + scope, attributes, block);
    this.rowIndex = 0;
    return this.scope = "table";
  });

  __defineProperty(ViewTable,  "row", function() {
    var args, attributes, block, _i;
    args = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), block = arguments[_i++];
    attributes = _.extractOptions(args);
    attributes.scope = "row";
    if (this.scope === "body") {
      attributes.role = "row";
    }
    this.rowIndex += 1;
    this.cellIndex = 0;
    this.tag("tr", attributes, block);
    return this.cellIndex = 0;
  });

  __defineProperty(ViewTable,  "column", function() {
    var args, attributes, block, value, _base, _i;
    args = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), block = arguments[_i++];
    attributes = _.extractOptions(args);
    value = args.shift();
    if (typeof (_base = Tower.View.idEnabledOn).include === "function" ? _base.include("table") : void 0) {
      attributes.id || (attributes.id = this.idFor("header", key, value, this.rowIndex, this.cellIndex));
    }
    if (attributes.hasOwnProperty("width")) {
      attributes.width = this.pixelate(attributes.width);
    }
    if (attributes.hasOwnProperty("height")) {
      attributes.height = this.pixelate(attributes.height);
    }
    this.headers.push(attributes.id);
    tag("col", attributes);
    return this.cellIndex += 1;
  });

  __defineProperty(ViewTable,  "header", function() {
    var args, attributes, block, direction, label, sort, value, _base,
      _this = this;
    args = _.args(arguments);
    block = _.extractBlock(args);
    attributes = _.extractOptions(args);
    value = args.shift();
    attributes.abbr || (attributes.abbr = value);
    attributes.role = "columnheader";
    if (typeof (_base = Tower.View.idEnabledOn).include === "function" ? _base.include("table") : void 0) {
      attributes.id || (attributes.id = this.idFor("header", key, value, this.rowIndex, this.cellIndex));
    }
    attributes.scope = "col";
    if (attributes.hasOwnProperty("for")) {
      attributes.abbr || (attributes.abbr = attributes["for"]);
    }
    attributes.abbr || (attributes.abbr = value);
    delete attributes["for"];
    if (attributes.hasOwnProperty("width")) {
      attributes.width = this.pixelate(attributes.width);
    }
    if (attributes.hasOwnProperty("height")) {
      attributes.height = this.pixelate(attributes.height);
    }
    sort = attributes.sort === true;
    delete attributes.sort;
    if (sort) {
      attributes["class"] = this.addClass(attributes["class"] || "", [attributes.sortClass || "sortable"]);
      attributes.direction || (attributes.direction = "asc");
    }
    delete attributes.sortClass;
    label = attributes.label || _.titleize(value.toString());
    delete attributes.label;
    direction = attributes.direction;
    delete attributes.direction;
    if (direction) {
      attributes["aria-sort"] = direction;
      attributes["class"] = [attributes["class"], direction].join(" ");
      attributes["aria-selected"] = true;
    } else {
      attributes["aria-sort"] = "none";
      attributes["aria-selected"] = false;
    }
    this.headers.push(attributes.id);
    if (block) {
      this.tag("th", attributes, block);
    } else {
      if (sort) {
        this.tag("th", attributes, function() {
          return _this.linkToSort(label, value);
        });
      } else {
        this.tag("th", attributes, function() {
          return _this.tag("span", label);
        });
      }
    }
    return this.cellIndex += 1;
  });

  __defineProperty(ViewTable,  "linkToSort", function(label, value) {
    var direction,
      _this = this;
    direction = "+";
    return this.tag("a", {
      href: "?sort=" + direction
    }, function() {
      return _this.tag("span", label);
    });
  });

  __defineProperty(ViewTable,  "cell", function() {
    var args, attributes, block, value, _base, _i;
    args = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), block = arguments[_i++];
    attributes = _.extractOptions(args);
    value = args.shift();
    attributes.role = "gridcell";
    if (typeof (_base = Tower.View.idEnabledOn).include === "function" ? _base.include("table") : void 0) {
      attributes.id || (attributes.id = this.idFor("cell", key, value, this.rowIndex, this.cellIndex));
    }
    attributes.headers = this.headers[this.cellIndex];
    if (attributes.hasOwnProperty("width")) {
      attributes.width = this.pixelate(attributes.width);
    }
    if (attributes.hasOwnProperty("height")) {
      attributes.height = this.pixelate(attributes.height);
    }
    if (block) {
      this.tag("td", attributes, block);
    } else {
      this.tag("td", value, attributes);
    }
    return this.cellIndex += 1;
  });

  __defineProperty(ViewTable,  "recordKey", function(recordOrKey) {
    if (typeof recordOrKey === "string") {
      return recordOrKey;
    } else {
      return recordOrKey.constructor.name;
    }
  });

  __defineProperty(ViewTable,  "idFor", function(type, key, value, row_index, column_index) {
    if (row_index == null) {
      row_index = this.row_index;
    }
    if (column_index == null) {
      column_index = this.column_index;
    }
    [key, type, row_index, column_index].compact.map(function(node) {
      return node.replace(/[\s_]/, "-");
    });
    return end.join("-");
  });

  __defineProperty(ViewTable,  "pixelate", function(value) {
    if (typeof value === "string") {
      return value;
    } else {
      return "" + value + "px";
    }
  });

  return ViewTable;

})(Tower.ViewComponent);
