var get = Ember.get,
  getPath = Ember.getPath,
  set = Ember.set,
  fmt = Ember.String.fmt;
var window = global.window;
// ==========================================================================
// Project:   metamorph
// Copyright: ©2011 My Company Inc. All rights reserved.
// ==========================================================================
var K = function() {},
  guid = 0,
  document = global.document,
  // Feature-detect the W3C range API, the extended check is for IE9 which only partially supports ranges
  supportsRange = ('createRange' in document) && (typeof Range !== 'undefined') && Range.prototype.createContextualFragment,

  // Internet Explorer prior to 9 does not allow setting innerHTML if the first element
  // is a "zero-scope" element. This problem can be worked around by making
  // the first node an invisible text node. We, like Modernizr, use &shy;
  needsShy = (function() {
    var testEl = document.createElement('div');
    testEl.innerHTML = "<div></div>";
    testEl.firstChild.innerHTML = "<script></script>";
    return testEl.firstChild.innerHTML === '';
  })();

// Constructor that supports either Metamorph('foo') or new
// Metamorph('foo');
// 
// Takes a string of HTML as the argument.
var Metamorph = function(html) {
    var self;

    if(this instanceof Metamorph) {
      self = this;
    } else {
      self = new K();
    }

    self.innerHTML = html;
    var myGuid = 'metamorph-' + (guid++);
    self.start = myGuid + '-start';
    self.end = myGuid + '-end';

    return self;
  };

K.prototype = Metamorph.prototype;

var rangeFor, htmlFunc, removeFunc, outerHTMLFunc, appendToFunc, afterFunc, prependFunc, startTagFunc, endTagFunc;

outerHTMLFunc = function() {
  return this.startTag() + this.innerHTML + this.endTag();
};

startTagFunc = function() {
  return "<script id='" + this.start + "' type='text/x-placeholder'></script>";
};

endTagFunc = function() {
  return "<script id='" + this.end + "' type='text/x-placeholder'></script>";
};

// If we have the W3C range API, this process is relatively straight forward.
if(supportsRange) {

  // IE 9 supports ranges but doesn't define createContextualFragment
  if(!Range.prototype.createContextualFragment) {
    Range.prototype.createContextualFragment = function(html) {
      var frag = document.createDocumentFragment(),
        div = document.createElement("div");
      frag.appendChild(div);
      div.outerHTML = html;
      return frag;
    };
  }

  // Get a range for the current morph. Optionally include the starting and
  // ending placeholders.
  rangeFor = function(morph, outerToo) {
    var range = document.createRange();
    var before = document.getElementById(morph.start);
    var after = document.getElementById(morph.end);

    if(outerToo) {
      range.setStartBefore(before);
      range.setEndAfter(after);
    } else {
      range.setStartAfter(before);
      range.setEndBefore(after);
    }

    return range;
  };

  htmlFunc = function(html, outerToo) {
    // get a range for the current metamorph object
    var range = rangeFor(this, outerToo);

    // delete the contents of the range, which will be the
    // nodes between the starting and ending placeholder.
    range.deleteContents();

    // create a new document fragment for the HTML
    var fragment = range.createContextualFragment(html);

    // insert the fragment into the range
    range.insertNode(fragment);
  };

  removeFunc = function() {
    // get a range for the current metamorph object including
    // the starting and ending placeholders.
    var range = rangeFor(this, true);

    // delete the entire range.
    range.deleteContents();
  };

  appendToFunc = function(node) {
    var range = document.createRange();
    range.setStart(node);
    range.collapse(false);
    var frag = range.createContextualFragment(this.outerHTML());
    node.appendChild(frag);
  };

  afterFunc = function(html) {
    var range = document.createRange();
    var after = document.getElementById(this.end);

    range.setStartAfter(after);
    range.setEndAfter(after);

    var fragment = range.createContextualFragment(html);
    range.insertNode(fragment);
  };

  prependFunc = function(html) {
    var range = document.createRange();
    var start = document.getElementById(this.start);

    range.setStartAfter(start);
    range.setEndAfter(start);

    var fragment = range.createContextualFragment(html);
    range.insertNode(fragment);
  };

} else {
  /**
   * This code is mostly taken from jQuery, with one exception. In jQuery's case, we
   * have some HTML and we need to figure out how to convert it into some nodes.
   *
   * In this case, jQuery needs to scan the HTML looking for an opening tag and use
   * that as the key for the wrap map. In our case, we know the parent node, and
   * can use its type as the key for the wrap map.
   **/
  var wrapMap = {
    select: [1, "<select multiple='multiple'>", "</select>"],
    fieldset: [1, "<fieldset>", "</fieldset>"],
    table: [1, "<table>", "</table>"],
    tbody: [2, "<table><tbody>", "</tbody></table>"],
    tr: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
    colgroup: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
    map: [1, "<map>", "</map>"],
    _default: [0, "", ""]
  };

  /**
   * Given a parent node and some HTML, generate a set of nodes. Return the first
   * node, which will allow us to traverse the rest using nextSibling.
   *
   * We need to do this because innerHTML in IE does not really parse the nodes.
   **/
  var firstNodeFor = function(parentNode, html) {
      var arr = wrapMap[parentNode.tagName.toLowerCase()] || wrapMap._default;
      var depth = arr[0],
        start = arr[1],
        end = arr[2];

      if(needsShy) {
        html = '&shy;' + html;
      }

      var element = document.createElement('div');
      element.innerHTML = start + html + end;

      for(var i = 0; i <= depth; i++) {
        element = element.firstChild;
      }

      // Look for &shy; to remove it.
      if(needsShy) {
        var shyElement = element;

        // Sometimes we get nameless elements with the shy inside
        while(shyElement.nodeType === 1 && !shyElement.nodeName && shyElement.childNodes.length === 1) {
          shyElement = shyElement.firstChild;
        }

        // At this point it's the actual unicode character.
        if(shyElement.nodeType === 3 && shyElement.nodeValue.charAt(0) === "\u00AD") {
          shyElement.nodeValue = shyElement.nodeValue.slice(1);
        }
      }

      return element;
    };

  /**
   * In some cases, Internet Explorer can create an anonymous node in
   * the hierarchy with no tagName. You can create this scenario via:
   *
   *     div = document.createElement("div");
   *     div.innerHTML = "<table>&shy<script></script><tr><td>hi</td></tr></table>";
   *     div.firstChild.firstChild.tagName //=> ""
   *
   * If our script markers are inside such a node, we need to find that
   * node and use *it* as the marker.
   **/
  var realNode = function(start) {
      while(start.parentNode.tagName === "") {
        start = start.parentNode;
      }

      return start;
    };

  /**
   * When automatically adding a tbody, Internet Explorer inserts the
   * tbody immediately before the first <tr>. Other browsers create it
   * before the first node, no matter what.
   *
   * This means the the following code:
   *
   *     div = document.createElement("div");
   *     div.innerHTML = "<table><script id='first'></script><tr><td>hi</td></tr><script id='last'></script></table>
   *
   * Generates the following DOM in IE:
   *
   *     + div
   *       + table
   *         - script id='first'
   *         + tbody
   *           + tr
   *             + td
   *               - "hi"
   *           - script id='last'
   *
   * Which means that the two script tags, even though they were
   * inserted at the same point in the hierarchy in the original
   * HTML, now have different parents.
   *
   * This code reparents the first script tag by making it the tbody's
   * first child.
   **/
  var fixParentage = function(start, end) {
      if(start.parentNode !== end.parentNode) {
        end.parentNode.insertBefore(start, end.parentNode.firstChild);
      }
    };

  htmlFunc = function(html, outerToo) {
    // get the real starting node. see realNode for details.
    var start = realNode(document.getElementById(this.start));
    var end = document.getElementById(this.end);
    var parentNode = end.parentNode;
    var node, nextSibling, last;

    // make sure that the start and end nodes share the same
    // parent. If not, fix it.
    fixParentage(start, end);

    // remove all of the nodes after the starting placeholder and
    // before the ending placeholder.
    node = start.nextSibling;
    while(node) {
      nextSibling = node.nextSibling;
      last = node === end;

      // if this is the last node, and we want to remove it as well,
      // set the `end` node to the next sibling. This is because
      // for the rest of the function, we insert the new nodes
      // before the end (note that insertBefore(node, null) is
      // the same as appendChild(node)).
      //
      // if we do not want to remove it, just break.
      if(last) {
        if(outerToo) {
          end = node.nextSibling;
        } else {
          break;
        }
      }

      node.parentNode.removeChild(node);

      // if this is the last node and we didn't break before
      // (because we wanted to remove the outer nodes), break
      // now.
      if(last) {
        break;
      }

      node = nextSibling;
    }

    // get the first node for the HTML string, even in cases like
    // tables and lists where a simple innerHTML on a div would
    // swallow some of the content.
    node = firstNodeFor(start.parentNode, html);

    // copy the nodes for the HTML between the starting and ending
    // placeholder.
    while(node) {
      nextSibling = node.nextSibling;
      parentNode.insertBefore(node, end);
      node = nextSibling;
    }
  };

  // remove the nodes in the DOM representing this metamorph.
  //
  // this includes the starting and ending placeholders.
  removeFunc = function() {
    var start = realNode(document.getElementById(this.start));
    var end = document.getElementById(this.end);

    this.html('');
    start.parentNode.removeChild(start);
    end.parentNode.removeChild(end);
  };

  appendToFunc = function(parentNode) {
    var node = firstNodeFor(parentNode, this.outerHTML());

    while(node) {
      nextSibling = node.nextSibling;
      parentNode.appendChild(node);
      node = nextSibling;
    }
  };

  afterFunc = function(html) {
    // get the real starting node. see realNode for details.
    var end = document.getElementById(this.end);
    var parentNode = end.parentNode;
    var nextSibling;
    var node;

    // get the first node for the HTML string, even in cases like
    // tables and lists where a simple innerHTML on a div would
    // swallow some of the content.
    node = firstNodeFor(parentNode, html);

    // copy the nodes for the HTML between the starting and ending
    // placeholder.
    while(node) {
      nextSibling = node.nextSibling;
      parentNode.insertBefore(node, end.nextSibling);
      node = nextSibling;
    }
  };

  prependFunc = function(html) {
    var start = document.getElementById(this.start);
    var parentNode = start.parentNode;
    var nextSibling;
    var node;

    node = firstNodeFor(parentNode, html);
    var insertBefore = start.nextSibling;

    while(node) {
      nextSibling = node.nextSibling;
      parentNode.insertBefore(node, insertBefore);
      node = nextSibling;
    }
  }
}

Metamorph.prototype.html = function(html) {
  this.checkRemoved();
  if(html === undefined) {
    return this.innerHTML;
  }

  htmlFunc.call(this, html);

  this.innerHTML = html;
};

Metamorph.prototype.replaceWith = function(html) {
  this.checkRemoved();
  htmlFunc.call(this, html, true);
};

Metamorph.prototype.remove = removeFunc;
Metamorph.prototype.outerHTML = outerHTMLFunc;
Metamorph.prototype.appendTo = appendToFunc;
Metamorph.prototype.after = afterFunc;
Metamorph.prototype.prepend = prependFunc;
Metamorph.prototype.startTag = startTagFunc;
Metamorph.prototype.endTag = endTagFunc;

Metamorph.prototype.isRemoved = function() {
  var before = document.getElementById(this.start);
  var after = document.getElementById(this.end);

  return !before || !after;
};

Metamorph.prototype.checkRemoved = function() {
  if(this.isRemoved()) {
    throw new Error("Cannot perform operations on a Metamorph that is not in the DOM.");
  }
};

window.Metamorph = Metamorph;



Ember.Metamorph = Ember.Mixin.create({
  isVirtual: true,
  tagName: '',

  init: function() {
    this._super();
    set(this, 'morph', Metamorph());
  },

  beforeRender: function(buffer) {
    var morph = get(this, 'morph');
    buffer.push(morph.startTag());
  },

  afterRender: function(buffer) {
    var morph = get(this, 'morph');
    buffer.push(morph.endTag());
  },

  createElement: function() {
    var buffer = this.renderToBuffer();
    set(this, 'outerHTML', buffer.string());
    this.clearBuffer();
  },

  domManagerClass: Ember.Object.extend({
    remove: function(view) {
      var morph = getPath(this, 'view.morph');
      if(morph.isRemoved()) {
        return;
      }
      getPath(this, 'view.morph').remove();
    },

    prepend: function(childView) {
      var view = get(this, 'view');

      childView._insertElementLater(function() {
        var morph = get(view, 'morph');
        morph.prepend(get(childView, 'outerHTML'));
        childView.set('outerHTML', null);
      });
    },

    after: function(nextView) {
      var view = get(this, 'view');

      nextView._insertElementLater(function() {
        var morph = get(view, 'morph');
        morph.after(get(nextView, 'outerHTML'));
        nextView.set('outerHTML', null);
      });
    },

    replace: function() {
      var view = get(this, 'view');
      var morph = getPath(this, 'view.morph');

      view.transitionTo('preRender');
      view.clearRenderedChildren();
      var buffer = view.renderToBuffer();

      Ember.run.schedule('render', this, function() {
        if(get(view, 'isDestroyed')) {
          return;
        }
        view._notifyWillInsertElement();
        morph.replaceWith(buffer.string());
        view.transitionTo('inDOM');
        view._notifyDidInsertElement();
      });
    }
  })
});

/**
  @ignore
  @private
  @class

  Ember._BindableSpanView is a private view created by the Handlebars `{{bind}}` 
  helpers that is used to keep track of bound properties.

  Every time a property is bound using a `{{mustache}}`, an anonymous subclass 
  of Ember._BindableSpanView is created with the appropriate sub-template and 
  context set up. When the associated property changes, just the template for 
  this view will re-render.
*/
Ember._BindableSpanView = Ember.View.extend(Ember.Metamorph, /** @scope Ember._BindableSpanView.prototype */ {

  /**
    The function used to determine if the `displayTemplate` or
    `inverseTemplate` should be rendered. This should be a function that takes
    a value and returns a Boolean.

    @type Function
    @default null
  */
  shouldDisplayFunc: null,

  /**
    Whether the template rendered by this view gets passed the context object
    of its parent template, or gets passed the value of retrieving `property`
    from the previous context.

    For example, this is true when using the `{{#if}}` helper, because the 
    template inside the helper should look up properties relative to the same 
    object as outside the block. This would be NO when used with `{{#with 
    foo}}` because the template should receive the object found by evaluating 
    `foo`.

    @type Boolean
    @default false
  */
  preserveContext: false,

  /**
    The template to render when `shouldDisplayFunc` evaluates to true.

    @type Function
    @default null
  */
  displayTemplate: null,

  /**
    The template to render when `shouldDisplayFunc` evaluates to false.

    @type Function
    @default null
  */
  inverseTemplate: null,

  /**
    The key to look up on `previousContext` that is passed to
    `shouldDisplayFunc` to determine which template to render.

    In addition, if `preserveContext` is false, this object will be passed to 
    the template when rendering.

    @type String
    @default null
  */
  property: null,

  /**
    Determines which template to invoke, sets up the correct state based on
    that logic, then invokes the default Ember.View `render` implementation.

    This method will first look up the `property` key on `previousContext`,
    then pass that value to the `shouldDisplayFunc` function. If that returns
    true, the `displayTemplate` function will be rendered to DOM. Otherwise,
    `inverseTemplate`, if specified, will be rendered.

    For example, if this Ember._BindableSpan represented the {{#with foo}} 
    helper, it would look up the `foo` property of its context, and 
    `shouldDisplayFunc` would always return true. The object found by looking 
    up `foo` would be passed to `displayTemplate`.

    @param {Ember.RenderBuffer} buffer
  */
  render: function(buffer) {
    // If not invoked via a triple-mustache ({{{foo}}}), escape
    // the content of the template.
    var escape = get(this, 'isEscaped');

    var shouldDisplay = get(this, 'shouldDisplayFunc'),
      property = get(this, 'property'),
      preserveContext = get(this, 'preserveContext'),
      context = get(this, 'previousContext');

    var inverseTemplate = get(this, 'inverseTemplate'),
      displayTemplate = get(this, 'displayTemplate');

    var result;


    // Use the current context as the result if no
    // property is provided.
    if(property === '') {
      result = context;
    } else {
      result = get(context, property);
    }

    // First, test the conditional to see if we should
    // render the template or not.
    if(shouldDisplay(result)) {
      set(this, 'template', displayTemplate);

      // If we are preserving the context (for example, if this
      // is an #if block, call the template with the same object.
      if(preserveContext) {
        set(this, 'templateContext', context);
      } else {
        // Otherwise, determine if this is a block bind or not.
        // If so, pass the specified object to the template
        if(displayTemplate) {
          set(this, 'templateContext', result);
        } else {
          // This is not a bind block, just push the result of the
          // expression to the render context and return.
          if(result == null) {
            result = "";
          } else {
            result = String(result);
          }
          if(escape) {
            result = Handlebars.Utils.escapeExpression(result);
          }
          buffer.push(result);
          return;
        }
      }
    } else if(inverseTemplate) {
      set(this, 'template', inverseTemplate);

      if(preserveContext) {
        set(this, 'templateContext', context);
      } else {
        set(this, 'templateContext', result);
      }
    } else {
      set(this, 'template', function() {
        return '';
      });
    }

    return this._super(buffer);
  }
});

(function() {
  // Binds a property into the DOM. This will create a hook in DOM that the
  // KVO system will look for and upate if the property changes.
  var bind = function(property, options, preserveContext, shouldDisplay) {
      var data = options.data,
        fn = options.fn,
        inverse = options.inverse,
        view = data.view,
        ctx = this;

      // Set up observers for observable objects
      if('object' === typeof this) {
        // Create the view that will wrap the output of this template/property 
        // and add it to the nearest view's childViews array.
        // See the documentation of Ember._BindableSpanView for more.
        console.log(Ember._BindableSpanView);
        var bindView = view.createChildView(Ember._BindableSpanView, {
          preserveContext: preserveContext,
          shouldDisplayFunc: shouldDisplay,
          displayTemplate: fn,
          inverseTemplate: inverse,
          property: property,
          previousContext: ctx,
          isEscaped: options.hash.escaped
        });

        view.appendChild(bindView);

        var observer, invoker;

        /** @private */
        observer = function() {
          // Double check since sometimes the view gets destroyed after this observer is already queued
          if(!get(bindView, 'isDestroyed')) {
            bindView.rerender();
          }
        };

        /** @private */
        invoker = function() {
          Ember.run.once(observer);
        };

        // Observes the given property on the context and
        // tells the Ember._BindableSpan to re-render. If property
        // is an empty string, we are printing the current context
        // object ({{this}}) so updating it is not our responsibility.
        if(property !== '') {
          Ember.addObserver(ctx, property, invoker);
        }
      } else {
        // The object is not observable, so just render it out and
        // be done with it.
        data.buffer.push(getPath(this, property));
      }
    };

  /**
    '_triageMustache' is used internally select between a binding and helper for 
    the given context. Until this point, it would be hard to determine if the 
    mustache is a property reference or a regular helper reference. This triage
    helper resolves that.
    
    This would not be typically invoked by directly.
    
    @private
    @name Handlebars.helpers._triageMustache
    @param {String} property Property/helperID to triage
    @param {Function} fn Context to provide for rendering
    @returns {String} HTML string
  */
  Ember.Handlebars.registerHelper('_triageMustache', function(property, fn) {
    ember_assert("You cannot pass more than one argument to the _triageMustache helper", arguments.length <= 2);
    if(Ember.Handlebars.helpers[property]) {
      return Ember.Handlebars.helpers[property].call(this, fn);
    } else {
      return Ember.Handlebars.helpers.bind.apply(this, arguments);
    }
  });

  /**
    `bind` can be used to display a value, then update that value if it 
    changes. For example, if you wanted to print the `title` property of 
    `content`:

        {{bind "content.title"}}

    This will return the `title` property as a string, then create a new 
    observer at the specified path. If it changes, it will update the value in 
    DOM. Note that if you need to support IE7 and IE8 you must modify the 
    model objects properties using Ember.get() and Ember.set() for this to work as 
    it relies on Ember's KVO system.  For all other browsers this will be handled
    for you automatically.

    @private
    @name Handlebars.helpers.bind
    @param {String} property Property to bind
    @param {Function} fn Context to provide for rendering
    @returns {String} HTML string
  */
  Ember.Handlebars.registerHelper('bind', function(property, fn) {
    ember_assert("You cannot pass more than one argument to the bind helper", arguments.length <= 2);

    var context = (fn.contexts && fn.contexts[0]) || this;

    return bind.call(context, property, fn, false, function(result) {
      return !Ember.none(result);
    });
  });

  /**
    Use the `boundIf` helper to create a conditional that re-evaluates 
    whenever the bound value changes.

        {{#boundIf "content.shouldDisplayTitle"}}
          {{content.title}}
        {{/boundIf}}

    @private
    @name Handlebars.helpers.boundIf
    @param {String} property Property to bind
    @param {Function} fn Context to provide for rendering
    @returns {String} HTML string
  */
  Ember.Handlebars.registerHelper('boundIf', function(property, fn) {
    var context = (fn.contexts && fn.contexts[0]) || this;

    return bind.call(context, property, fn, true, function(result) {
      if(Ember.typeOf(result) === 'array') {
        return get(result, 'length') !== 0;
      } else {
        return !!result;
      }
    });
  });
})();

/**
  @name Handlebars.helpers.with
  @param {Function} context
  @param {Hash} options
  @returns {String} HTML string
*/
Ember.Handlebars.registerHelper('with', function(context, options) {
  ember_assert("You must pass exactly one argument to the with helper", arguments.length == 2);
  ember_assert("You must pass a block to the with helper", options.fn && options.fn !== Handlebars.VM.noop);

  return Ember.Handlebars.helpers.bind.call(options.contexts[0], context, options);
});


/**
  @name Handlebars.helpers.if
  @param {Function} context
  @param {Hash} options
  @returns {String} HTML string
*/
Ember.Handlebars.registerHelper('if', function(context, options) {
  ember_assert("You must pass exactly one argument to the if helper", arguments.length == 2);
  ember_assert("You must pass a block to the if helper", options.fn && options.fn !== Handlebars.VM.noop);

  return Ember.Handlebars.helpers.boundIf.call(options.contexts[0], context, options);
});

/**
  @name Handlebars.helpers.unless
  @param {Function} context
  @param {Hash} options
  @returns {String} HTML string
*/
Ember.Handlebars.registerHelper('unless', function(context, options) {
  ember_assert("You must pass exactly one argument to the unless helper", arguments.length == 2);
  ember_assert("You must pass a block to the unless helper", options.fn && options.fn !== Handlebars.VM.noop);

  var fn = options.fn,
    inverse = options.inverse;

  options.fn = inverse;
  options.inverse = fn;

  return Ember.Handlebars.helpers.boundIf.call(options.contexts[0], context, options);
});

/**
  `bindAttr` allows you to create a binding between DOM element attributes and
  Ember objects. For example:

      <img {{bindAttr src="imageUrl" alt="imageTitle"}}>

  @name Handlebars.helpers.bindAttr
  @param {Hash} options
  @returns {String} HTML string
*/
Ember.Handlebars.registerHelper('bindAttr', function(options) {

  var attrs = options.hash;

  ember_assert("You must specify at least one hash argument to bindAttr", !! Ember.keys(attrs).length);

  var view = options.data.view;
  var ret = [];
  var ctx = this;

  // Generate a unique id for this element. This will be added as a
  // data attribute to the element so it can be looked up when
  // the bound property changes.
  var dataId = ++jQuery.uuid;

  // Handle classes differently, as we can bind multiple classes
  var classBindings = attrs['class'];
  if(classBindings !== null && classBindings !== undefined) {
    var classResults = Ember.Handlebars.bindClasses(this, classBindings, view, dataId);
    ret.push('class="' + classResults.join(' ') + '"');
    delete attrs['class'];
  }

  var attrKeys = Ember.keys(attrs);

  // For each attribute passed, create an observer and emit the
  // current value of the property as an attribute.
  attrKeys.forEach(function(attr) {
    var property = attrs[attr];

    ember_assert(fmt("You must provide a String for a bound attribute, not %@", [property]), typeof property === 'string');

    var value = getPath(ctx, property);

    ember_assert(fmt("Attributes must be numbers, strings or booleans, not %@", [value]), value == null || typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean');

    var observer, invoker;

    /** @private */
    observer = function observer() {
      var result = getPath(ctx, property);

      ember_assert(fmt("Attributes must be numbers, strings or booleans, not %@", [result]), result == null || typeof result === 'number' || typeof result === 'string' || typeof result === 'boolean');

      var elem = view.$("[data-bindAttr-" + dataId + "='" + dataId + "']");

      // If we aren't able to find the element, it means the element
      // to which we were bound has been removed from the view.
      // In that case, we can assume the template has been re-rendered
      // and we need to clean up the observer.
      if(elem.length === 0) {
        Ember.removeObserver(ctx, property, invoker);
        return;
      }

      Ember.View.applyAttributeBindings(elem, attr, result);
    };

    /** @private */
    invoker = function() {
      Ember.run.once(observer);
    };

    // Add an observer to the view for when the property changes.
    // When the observer fires, find the element using the
    // unique data id and update the attribute to the new value.
    Ember.addObserver(ctx, property, invoker);

    // if this changes, also change the logic in ember-views/lib/views/view.js
    var type = typeof value;

    if((type === 'string' || (type === 'number' && !isNaN(value)))) {
      ret.push(attr + '="' + value + '"');
    } else if(value && type === 'boolean') {
      ret.push(attr + '="' + attr + '"');
    }
  }, this);

  // Add the unique identifier
  ret.push('data-bindAttr-' + dataId + '="' + dataId + '"');
  return new Ember.Handlebars.SafeString(ret.join(' '));
});

/**
  Helper that, given a space-separated string of property paths and a context,
  returns an array of class names. Calling this method also has the side 
  effect of setting up observers at those property paths, such that if they 
  change, the correct class name will be reapplied to the DOM element.

  For example, if you pass the string "fooBar", it will first look up the 
  "fooBar" value of the context. If that value is YES, it will add the 
  "foo-bar" class to the current element (i.e., the dasherized form of 
  "fooBar"). If the value is a string, it will add that string as the class. 
  Otherwise, it will not add any new class name.

  @param {Ember.Object} context 
    The context from which to lookup properties

  @param {String} classBindings 
    A string, space-separated, of class bindings to use

  @param {Ember.View} view
    The view in which observers should look for the element to update

  @param {Srting} bindAttrId
    Optional bindAttr id used to lookup elements

  @returns {Array} An array of class names to add
*/
Ember.Handlebars.bindClasses = function(context, classBindings, view, bindAttrId) {
  var ret = [],
    newClass, value, elem;

  // Helper method to retrieve the property from the context and
  // determine which class string to return, based on whether it is
  // a Boolean or not.
  var classStringForProperty = function(property) {
      var split = property.split(':'),
        property = split[0],
        className = split[1];

      var val = getPath(context, property);

      // If value is a Boolean and true, return the dasherized property
      // name.
      if(val === YES) {
        if(className) {
          return className;
        }

        // Normalize property path to be suitable for use
        // as a class name. For exaple, content.foo.barBaz
        // becomes bar-baz.
        var parts = property.split('.');
        return Ember.String.dasherize(parts[parts.length - 1]);

        // If the value is not NO, undefined, or null, return the current
        // value of the property.
      } else if(val !== NO && val !== undefined && val !== null) {
        return val;

        // Nothing to display. Return null so that the old class is removed
        // but no new class is added.
      } else {
        return null;
      }
    };

  // For each property passed, loop through and setup
  // an observer.
  classBindings.split(' ').forEach(function(binding) {

    // Variable in which the old class value is saved. The observer function
    // closes over this variable, so it knows which string to remove when
    // the property changes.
    var oldClass;

    var observer, invoker;

    // Set up an observer on the context. If the property changes, toggle the
    // class name.
    /** @private */
    observer = function() {
      // Get the current value of the property
      newClass = classStringForProperty(binding);
      elem = bindAttrId ? view.$("[data-bindAttr-" + bindAttrId + "='" + bindAttrId + "']") : view.$();

      // If we can't find the element anymore, a parent template has been
      // re-rendered and we've been nuked. Remove the observer.
      if(elem.length === 0) {
        Ember.removeObserver(context, binding, invoker);
      } else {
        // If we had previously added a class to the element, remove it.
        if(oldClass) {
          elem.removeClass(oldClass);
        }

        // If necessary, add a new class. Make sure we keep track of it so
        // it can be removed in the future.
        if(newClass) {
          elem.addClass(newClass);
          oldClass = newClass;
        } else {
          oldClass = null;
        }
      }
    };

    /** @private */
    invoker = function() {
      Ember.run.once(observer);
    };

    property = binding.split(':')[0];
    Ember.addObserver(context, property, invoker);

    // We've already setup the observer; now we just need to figure out the 
    // correct behavior right now on the first pass through.
    value = classStringForProperty(binding);

    if(value) {
      ret.push(value);

      // Make sure we save the current value so that it can be removed if the 
      // observer fires.
      oldClass = value;
    }
  });

  return ret;
};