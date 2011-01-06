var initializing = false, fnTest = /xyz/.test(function () {xyz;}) ? /\b_super\b/ : /.*/;

function Ctor () {};
Ctor.prototype.instanceOf = function (class) {
  return this instanceof class.ctor;
};

var Class = {
  subclasses: [],
  new: function () {
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
    var subclass = Object.create(this);
    function F () {
      if (!initializing && this.init) {
        this.init.apply(this, arguments);
      }
    }
    initializing = true;
    F.prototype = new this.ctor();
    initializing = false;
    subclass.ctor = F;
    F.prototype.class = subclass;
    F.prototype.superclass = this;
    this.subclasses.push(subclass);
    subclass.superclass = this;
    subclass.subclasses = [];
    subclass.proto(methods);
    return subclass;
  }
};

module.exports = Class;
