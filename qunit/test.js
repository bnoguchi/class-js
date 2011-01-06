
(function() {var require = (function() {
  var _isArray = Array.isArray || function(obj) {
        return !!(obj && obj.concat && obj.unshift && !obj.callee);
      }
    , _keys = Object.keys || function(obj) {
        if (_isArray(obj)) return _.range(0, obj.length);
        var keys = [];
        for (var key in obj) if (Object.prototype.hasOwnProperty.call(obj, key)) keys[keys.length] = key;
        return keys;
      }
    , _dependencyGraph = {}
    , _factories = {} // Maps "ids" to factories that load its logic into a module.exports
    , _modules = {} // Maps "keys" to module objects of form {id: ..., exports: {...}}
    , _currDir
    , _contexts = [_currDir = './']
    , PREFIX = '__module__'; // Prefix identifiers to avoid issues in IE.
      
  /**
   * While context: ./
   * ----REQUIRE----             ----FACTORY NAME----
   * require('./index') ->       ./index
   * require('../lib/class')     ./../lib/class
   * require('lingo')            PATH/lingo
   *
   * While context: PATH/lingo/
   * require('./lib')            PATH/lingo/lib
   * require('../dir/index')     PATH/lingo/../dir/index
   * require('utils')            PATH/utils
   *
   * While context: PATH/lingo/../dir/
   * require('./lib')            PATH/lingo/../dir/lib
   * require('../lib')           PATH/lingo/../lib
   * require('../../lib')        PATH/lingo/../../lib  [PATH, lingo, .., dir, .., .., lib]
   *  
   */
  function require (identifier) {
    var id = resolveIdentifier(identifier)
      , key = PREFIX + id
      , mod = _modules[key] || (_modules[key] = loadModule(identifier, id, key));
    return mod.exports;
  }

  function loadModule (identifier, id, key) {
    var fn = _factories[key]
      , mod = { id: id, exports: {} }
      , expts = mod.exports;
    _contexts.push(_currDir = id.substring(0, id.lastIndexOf('/') + 1))
    try {
      if (!fn) { throw 'Can\'t find module "' + identifier + '" keyed as "' + id + '".'; }
      if (typeof fn === 'string') {
        fn = new Function('require', 'exports', 'module', fn);
      }
      fn(require, expts, mod);
      if (_keys(expts).length) mod.exports = expts;
      _contexts.pop();
      _currDir = _contexts[_contexts.length-1];
    } catch(e) {
      _contexts.pop();
      _currDir = _contexts[_contexts.length-1];
      // We'd use a finally statement here if it wasn't for IE.
      throw e;
    }
    return mod;
  }
  
  function resolveIdentifier (identifier) {
    if (identifier.charAt(0) !== '.') { // This module exists relative to PATH/
      var dir = ['PATH', identifier, ''].join('/');
      return _factories[PREFIX + dir + 'index'] 
        ? (dir + 'index')
        : dir.substring(0, dir.length-1);
    }

    var parts, part, path, dir;
    parts = _currDir.split('/').concat(identifier.split('/'));
    path = [];
    for (var i = 0, l = parts.length; i < l; i++) {
      part = parts[i];
      if (part === '') continue;
      if (part === '.') {
        if (path.length === 0 && parts[0] === '.') {
          path.push(part);
        }
      } else if (part === '..') {
        if (path[path.length-1].charAt(0) === '.' ||
            parts[0] === 'PATH' && path.length === 2) {
          path.push(part);
        } else {
          path.pop();
        }
      } else {
        path.push(part);
      }
    }
    return path.join('/');
  }
  
  function define (id2module) {
    for (var id in id2module) {
      _factories[PREFIX + id] = id2module[id];
    }
  }
  
  function ensure(factory) {
    factory();
  }
  
  require.define = define;
  require.ensure = ensure;
  require.main = {};

  return require; 
})()
, module = require.main;

require.define({
'./../class': function(require, exports, module) {
var initializing = false, fnTest = (new RegExp("xyz")).test(function () {xyz;}) ? new RegExp("\\b_super\\b") : new RegExp(".*");

function Ctor () {}
Ctor.prototype.instanceOf = function (klass) {
  return this instanceof klass.ctor;
};

var Class = {
  init: function () {
    initializing = true;
    var ret = new this.ctor();
    initializing = false;
    this.ctor.apply(ret, arguments);
    return ret;
  },
  ctor: Ctor,
  proto: function () {
    var prototype = this.ctor.prototype
      , extensions, k, v
      , self = this
      , _super = this.superclass && this.superclass.ctor.prototype;
    for (var i = 0, l = arguments.length; i < l; i++) {
      extensions = arguments[i];
      for (k in extensions) if (extensions.hasOwnProperty(k)) {
        v = extensions[k];
        prototype[k] = (typeof v === "function" && _super && typeof _super[k] === "function" && fnTest.test(v)) // If this function has a call to this._super
          ? // Give super access to the properties that are functions,
            // IF those functions have a call to this._super
            (function (name, fn) {
              // Give the function super access to the key values that are functions, if those
              // functions have a call to this._super.
              return function () {
                var tmp = this._super, ret;
                this._super = _super[name];
                ret = fn.apply(this, arguments);
                this._super = tmp;
                return ret;
              };
            })(k, v)
          : v; // else
      }
    }
  },
  subclass: function (methods) {
    function E () {}
    E.prototype = this;
    var subclass = new E ();
    function F () {
      if (!initializing && this.init) {
        this.init.apply(this, arguments);
      }
    }
    initializing = true;
    F.prototype = new this.ctor();
    initializing = false;
    subclass.ctor = F;
    F.prototype.klass = subclass;
    F.prototype.superclass = this;
    subclass.superclass = this;
    subclass.proto(methods);
    return subclass;
  }
};

module.exports = Class;

}
});
require.ensure(function() {
var Class = require('../class');

var A = Class.subclass({
  foo: 'bar',
  bark: function (to) {
    return "woof " + to;
  },
  inheritedFn: function () {
    return "a fortune!";
  }
});

A.hello = 'world';

var B = A.subclass({
  bark: function (to) {
    return this._super(to) + " and quack " + to;
  }
});


var b = B.init();

var Animal = Class.subclass({
  init: function (name) {
    this.name = name;
    this.sound = "unknown";
  },
  speak: function () {
    return this.name + ": " + this.sound;
  }
});

var Dog = Animal.subclass({
  init: function (name) {
    this._super(name);
    this.sound = "woof";
  },
});

var animal = Animal.init("animal");
var dog = Dog.init("spot");

window.module('Class');
test('a subclass should inherit instance attributes from its parent', function () {
  var b = B.init();
  equals(b.foo, 'bar');
});
test('a subclass should inherit instance methods from its parent', function () {
  equals(b.inheritedFn(), "a fortune!");
});
test('a subclass should inherit class attributes from its parent', function () {
  equals(B.hello, 'world');
});
test("changing a parent's class attributes should propagate the changes to its subclasses", function () {
  A.hello = 'notworld';
  equals(B.hello, 'notworld');
});
test("changing a parent's instance attributes should propagate the changes to its subclasses", function () {
  A.proto({foo: 'notbar'});
  equals(b.foo, 'notbar');
});
test('a subclass should have a reference to its superclass', function () {
  strictEqual(B.superclass, A);
});
test('a subclass instance should know it is an instance of the subclass', function () {
  ok(b.instanceOf(B));
});
test('a subclass instance should know it is also an instance of the superclass', function () {
  ok(b.instanceOf(A));
});
test('a subclass instance should know it is not an instance of a non-ancestor', function () {
  var C = A.subclass();
  ok(! b.instanceOf(C));
});
test('an instance should have access to its class', function () {
  strictEqual(b.klass, B);
});
test('a subclass instance should have access to its superclass', function () {
  strictEqual(b.superclass, A);
});
test('a subclass instance method should be able to invoke the super method in the superclass', function () {
  equals(b.bark('at you'), 'woof at you and quack at you');
});
test('classes should invoke init upon instantiation', function () {
  equals(animal.speak(), "animal: unknown");
  equals(dog.speak(), "spot: woof");
});

});
})();
