var ResolveJS;

ResolveJS = (function() {

  ResolveJS.prototype.requireMap = {};

  ResolveJS.prototype.extensionMap = {};

  ResolveJS.prototype.modules = {};

  ResolveJS.prototype.cache = {};

  ResolveJS.prototype.extensions = ["js", "coffee", "hbs", "handlebars", "handlebar", "template", "view"];

  ResolveJS.prototype.paths = [];

  ResolveJS.prototype.settings = {};

  function ResolveJS() {
    var _this = this;
    window.require = function(module, context) {
      return _this.resolve(module, context);
    };
  }

  ResolveJS.prototype.isFullyQualifiedNamespace = function(namespace) {
    return namespace.match(new RegExp("(?:^(?![.])(?:^[/]{0,1})?.+)(?=([.].+))")) !== null;
  };

  ResolveJS.prototype.isSemiQualifiedNamespace = function(namespace) {
    var absMatch, extMatch;
    extMatch = namespace.match(new RegExp("[.](?:.(?!\\.))+$"));
    absMatch = namespace.match(new RegExp("(?:^[/].+)"));
    return extMatch === null && absMatch !== null;
  };

  ResolveJS.prototype.isNonQualifiedNamespace = function(namespace) {
    var matchSlash, matchSlashAndExt;
    matchSlashAndExt = namespace.match(new RegExp("^\\.[/](?=(.+)?(\\.(?:.(?!\\.))+$))"));
    matchSlash = namespace.match(new RegExp("^\\.[/](?=(.+))"));
    return (null !== matchSlash) || (null !== matchSlash && matchSlashAndExt !== null);
  };

  ResolveJS.prototype.semiQualifiedNamespaceToFullyQualifiedNamespace = function(namespace) {
    var ext, key, module, testModuleAvailability, _ref;
    _ref = this.extensions;
    for (key in _ref) {
      ext = _ref[key];
      module = namespace + "." + ext;
      if (null !== module.match(/^\/{1}/)) {
        testModuleAvailability = module.replace(/^\/{1}/, "");
      }
      if (this.modules[testModuleAvailability] != null) {
        if (ext !== "js") {
          this.extensionMap[testModuleAvailability] = ext;
        }
        return module;
      }
    }
    return namespace + ".js";
  };

  ResolveJS.prototype.nonQualifiedNamespaceToFullyQualifiedNamespace = function(namespace, currentContext) {
    var currentDirectory, dirMatch, key, match, namespaceFileName, ns, qns;
    if (!(currentContext != null)) {
      currentContext = "/";
    }
    namespaceFileName = namespace.match(new RegExp("^.+/([^/]+)$"))[1];
    currentDirectory = currentContext.replace(new RegExp("^(.+)/([^/]+)$"), "$1");
    match = namespace.match(new RegExp("^([.][/])"));
    if (!(match != null)) {
      return new Error("Cannot transform namespace type. (Original Namespace Given: " + namespace + " ) (Original Context Given: " + currentContext + ")");
    }
    dirMatch = currentDirectory;
    for (key in match) {
      ns = match[key];
      if (ns !== 2 && ns !== namespace) {
        dirMatch = dirMatch.replace(new RegExp("^(.+)/([^/]+)$"), "$1");
      }
    }
    qns = dirMatch + "/" + namespaceFileName;
    if (this.isSemiQualifiedNamespace(qns)) {
      qns = this.semiQualifiedNamespaceToFullyQualifiedNamespace(qns);
    }
    return qns;
  };

  ResolveJS.prototype.isJSExtension = function(name) {
    if (name.match(/^.*\.(js)$/i) !== null) {
      return true;
    } else {
      return false;
    }
  };

  ResolveJS.prototype.createModule = function(file, contents) {
    if (this.isJSExtension(file)) {
      return this.modules[file] = this.appendSource(contents, file);
    } else {
      return this.modules[file] = contents;
    }
  };

  ResolveJS.prototype.appendSource = function(contents, file) {
    return contents + " //@ sourceURL=" + file;
  };

  ResolveJS.prototype.resolveNamespace = function(module, context) {
    var removeSlash, resolvedModule;
    removeSlash = function(name) {
      return name.replace(new RegExp("^[/]{1}"), "");
    };
    if (this.isFullyQualifiedNamespace(module)) {
      resolvedModule = removeSlash(module);
    } else if (this.isSemiQualifiedNamespace(module)) {
      resolvedModule = removeSlash(this.semiQualifiedNamespaceToFullyQualifiedNamespace(module));
    } else {
      if (this.isNonQualifiedNamespace(module)) {
        resolvedModule = removeSlash(this.nonQualifiedNamespaceToFullyQualifiedNamespace(module, context));
      }
    }
    if (resolvedModule.match(new RegExp("^[/]{1}"))) {
      resolvedModule = resolvedModule.replace(new RegExp("^[/]{1}"), "");
    }
    return resolvedModule;
  };

  ResolveJS.prototype.resolve = function(namespace, context) {
    var module;
    module = this.resolveNamespace(namespace, context);
    if (null !== module.match(/^\/{1}/)) {
      module = module.replace(/^\/{1}/, "");
    }
    if (this.modules[module] != null) {
      if (this.cache[module] != null) {
        return this.cache[module];
      } else {
        if (!(this.extensionMap[module] != null)) {
          this.cache[module] = this.parse(module, this.modules[module]);
          return this.cache[module];
        } else {
          this.cache[module] = this.modules[module];
          return this.cache[module];
        }
      }
    } else {
      throw new Error("Cannot resolve a module; " + module);
    }
  };

  ResolveJS.prototype.parse = function(name, contents) {
    var Closure, module;
    contents = contents.replace(new RegExp("require(\\((.+)\\))?([;,])"), "window.require($2, '" + name + "')$3");
    contents = decodeURIComponent(contents);
    Closure = function(module, exports) {
      var returnExports;
      try {
        eval(contents);
      } catch (e) {
        if (e instanceof SyntaxError) {
          throw new SyntaxError(e);
        }
      }
      if (module.exports != null) {
        returnExports = exports = module.exports;
      } else {
        returnExports = exports;
      }
      return returnExports;
    };
    module = {
      filename: name,
      parent: this.modules[name].parent,
      loaded: this.modules[name].loaded,
      exports: null
    };
    return Closure(module, {});
  };

  return ResolveJS;

})();

window.ResolveJS = ResolveJS;




