require('coffee-script');

// coffeescript extensions

var nodes = require('coffee-script/lib/coffee-script/nodes');
var Scope = require('coffee-script/lib/coffee-script/scope').Scope;
var helpers = require('coffee-script/lib/coffee-script/helpers');
var Literal = nodes.Literal;
var Extends = nodes.Extends;
var Code = nodes.Code;
var Param = nodes.Param;
var Block = nodes.Block;
var Call = nodes.Call;
var Assign = nodes.Assign;
var Value = nodes.Value;
var Parens = nodes.Parens;
var If = nodes.If;
var Arr = nodes.Arr;
var compact = helpers.compact;
var flatten = helpers.flatten;
var extend = helpers.extend;
var merge = helpers.merge;
var del = helpers.del;
var starts = helpers.starts;
var ends = helpers.ends;
var last = helpers.last;

var LEVEL_TOP = 1;
var LEVEL_PAREN = 2;
var LEVEL_LIST = 3;
var LEVEL_COND = 4;
var LEVEL_OP = 5;
var LEVEL_ACCESS = 6;
var TAB = '  ';
var IDENTIFIER_STR = "[$A-Za-z_\\x7f-\\uffff][$\\w\\x7f-\\uffff]*";
var IDENTIFIER = RegExp("^" + IDENTIFIER_STR + "$");
var SIMPLENUM = /^[+-]?\d+$/;
var METHOD_DEF = RegExp("^(?:(" + IDENTIFIER_STR + ")\\.prototype(?:\\.(" + IDENTIFIER_STR + ")|\\[(\"(?:[^\\\\\"\\r\\n]|\\\\.)*\"|'(?:[^\\\\'\\r\\n]|\\\\.)*')\\]|\\[(0x[\\da-fA-F]+|\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\]))|(" + IDENTIFIER_STR + ")$");
var IS_STRING = /^['"]/;
var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Code.prototype.compileNode = function(o) {
  var code, exprs, i, idt, lit, name, p, param, params, ref, splats, uniqs, val, wasEmpty, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _m, _n, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8;
  o.scope = new Scope(o.scope, this.body, this);
  o.scope.shared = del(o, 'sharedScope');
  o.indent += TAB;
  delete o.bare;
  delete o.isExistentialEquals;
  params = [];
  exprs = [];
  _ref2 = this.paramNames();
  for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
    name = _ref2[_i];
    if (!o.scope.check(name)) {
      o.scope.parameter(name);
    }
  }
  _ref3 = this.params;
  for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
    param = _ref3[_j];
    if (!param.splat) {
      continue;
    }
    _ref4 = this.params;
    for (_k = 0, _len2 = _ref4.length; _k < _len2; _k++) {
      p = _ref4[_k];
      if (p.name.value) {
        o.scope.add(p.name.value, 'var', true);
      }
    }
    splats = new Assign(new Value(new Arr((function() {
      var _l, _len3, _ref5, _results;
      _ref5 = this.params;
      _results = [];
      for (_l = 0, _len3 = _ref5.length; _l < _len3; _l++) {
        p = _ref5[_l];
        _results.push(p.asReference(o));
      }
      return _results;
    }).call(this))), new Value(new Literal('arguments')));
    break;
  }
  _ref5 = this.params;
  for (_l = 0, _len3 = _ref5.length; _l < _len3; _l++) {
    param = _ref5[_l];
    if (param.isComplex()) {
      val = ref = param.asReference(o);
      if (param.value) {
        val = new Op('?', ref, param.value);
      }
      exprs.push(new Assign(new Value(param.name), val, '=', {
        param: true
      }));
    } else {
      ref = param;
      if (param.value) {
        lit = new Literal(ref.name.value + ' == null');
        val = new Assign(new Value(param.name), param.value, '=');
        exprs.push(new If(lit, val));
      }
    }
    if (!splats) {
      params.push(ref);
    }
  }
  wasEmpty = this.body.isEmpty();
  if (splats) {
    exprs.unshift(splats);
  }
  if (exprs.length) {
    (_ref6 = this.body.expressions).unshift.apply(_ref6, exprs);
  }
  for (i = _m = 0, _len4 = params.length; _m < _len4; i = ++_m) {
    p = params[i];
    o.scope.parameter(params[i] = p.compile(o));
  }
  uniqs = [];
  _ref7 = this.paramNames();
  for (_n = 0, _len5 = _ref7.length; _n < _len5; _n++) {
    name = _ref7[_n];
    if (__indexOf.call(uniqs, name) >= 0) {
      throw SyntaxError("multiple parameters named '" + name + "'");
    }
    uniqs.push(name);
  }
  if (!(wasEmpty || this.noReturn)) {
    this.body.makeReturn();
  }
  if (this.bound) {
    if ((_ref8 = o.scope.parent.method) != null ? _ref8.bound : void 0) {
      this.bound = this.context = o.scope.parent.method.context;
    } else if (!this["static"]) {
      o.scope.parent.assign('_this', 'this');
    }
  }
  idt = o.indent;
  code = 'function';
  if (this.ctor) {
    code += ' ' + this.name;
  }
  code += '(' + params.join(', ') + ') {';
  if (!this.body.isEmpty()) {
    code += "\n" + (this.body.compileWithDeclarations(o)) + "\n" + this.tab;
  }
  code += '}';
  if (this.ctor) {
    return this.tab + code;
  }
  if (this.front || (o.level >= LEVEL_ACCESS)) {
    return "(" + code + ")";
  } else {
    return code;
  }
}

var Closure = {
  wrap: function(expressions, statement, noReturn) {
    var args, call, func, mentionsArgs, meth;
    if (expressions.jumps()) {
      return expressions;
    }
    func = new Code([], Block.wrap([expressions]));
    args = [];
    if ((mentionsArgs = expressions.contains(this.literalArgs)) || expressions.contains(this.literalThis)) {
      meth = new Literal(mentionsArgs ? 'apply' : 'call');
      args = [new Literal('this')];
      if (mentionsArgs) {
        args.push(new Literal('arguments'));
      }
      func = new Value(func, [new Access(meth)]);
    }
    func.noReturn = noReturn;
    call = new Call(func, args);
    if (statement) {
      return Block.wrap([call]);
    } else {
      return call;
    }
  },
  literalArgs: function(node) {
    return node instanceof Literal && node.value === 'arguments' && !node.asKey;
  },
  literalThis: function(node) {
    return (node instanceof Literal && node.value === 'this' && !node.asKey) || (node instanceof Code && node.bound) || (node instanceof Call && node.isSuper);
  }
};

Extends.prototype.compile = function(o) {
  return new nodes.Assign(this.child, new nodes.Call(new nodes.Value(new nodes.Literal(utility('extends'))), [this.child, this.parent])).compile(o);
};

nodes.Class.prototype.compileNode = function(o) {
  var call, decl, e, i, key, klass, lname, name, params, value, _i, _len, _ref2, _ref3;
  decl = this.determineName();
  name = decl || '_Class';
  if (name.reserved) {
    name = "_" + name;
  }
  lname = new Literal(name);
  this.hoistDirectivePrologue();
  this.setContext(name);
  this.walkBody(name, o);
  if (this.parent) {
    this.superClass = new Literal(o.scope.freeVariable('super', false));
    this.body.expressions.unshift(new Extends(lname, this.superClass));
  }
  this.ensureConstructor(name);
  this.body.spaced = true;
  if (!(this.ctor instanceof Code)) {
    this.body.expressions.unshift(this.ctor);
  }
  this.body.expressions.push(lname);
  (_ref2 = this.body.expressions).unshift.apply(_ref2, this.directives);
  _ref3 = this.body.expressions;
  for (i = _i = 0, _len = _ref3.length; _i < _len; i = ++_i) {
    e = _ref3[i];
    if (e._isInstanceProp) {
      key = e.variable.properties[e.variable.properties.length - 1].name.toString();
      value = e.value;
      this.body.expressions[i] = this.hookBodyExpression('instance', name, key, value);
    } else if (e._isClassProp) {
      key = e.variable.properties[e.variable.properties.length - 1].name.toString();
      value = e.value;
      this.body.expressions[i] = this.hookBodyExpression('class', name, key, value);
    }
  }
  this.addBoundFunctions(o);
  call = Closure.wrap(this.body);
  if (this.parent) {
    call.args.push(this.parent);
    params = call.variable.params || call.variable.base.params;
    params.push(new Param(this.superClass));
  }
  klass = new Parens(call, true);
  if (this.variable) {
    klass = new Assign(this.variable, klass);
  }
  return klass.compile(o);
};

utility = function(name) {
  var ref;
  ref = "__" + name;
  Scope.root.assign(ref, UTILITIES[name]());
  return ref;
};

UTILITIES = {
  defineStaticProperty: function() {
    return "function(clazz, key, value) {\n  if (typeof clazz.__defineStaticProperty == 'function') return clazz.__defineStaticProperty(key, value);\n  return clazz[key] = value;\n}";
  },
  defineProperty: function() {
    return "function(clazz, key, value) {\n  if (typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);\n  return clazz.prototype[key] = value;\n}";
  },
  "extends": function() {
    return "  function(child, parent) {\n    if (typeof parent.__extend == 'function') return parent.__extend(child);\n    for (var key in parent) { if (" + (utility('hasProp')) + ".call(parent, key)) child[key] = parent[key]; } \n    function ctor() { this.constructor = child; } \n    ctor.prototype = parent.prototype; \n    child.prototype = new ctor; \n    child.__super__ = parent.prototype; \n    if (typeof parent.extended == 'function') parent.extended(child); \n    return child; \n}";
  },
  bind: function() {
    return 'function(fn, me){ return function(){ return fn.apply(me, arguments); }; }';
  },
  indexOf: function() {
    return "[].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; }";
  },
  hasProp: function() {
    return '{}.hasOwnProperty';
  },
  slice: function() {
    return '[].slice';
  }
};
