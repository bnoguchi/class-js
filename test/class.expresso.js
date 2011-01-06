var assert = require('assert')
  , Class = require('../class');

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

module.exports = {
  'a sublcass should inherit instance attributes from its parent': function () {
    var b = B.init();
    assert.equal(b.foo, 'bar');
  },
  'a subclass should inherit instance methods from its parent': function () {
    assert.equal(b.inheritedFn(), "a fortune!");
  },
  'a subclass should inherit class attributes from its parent': function () {
    assert.equal(B.hello, 'world');
  },
  "changing a parent's class attributes should propagate the changes to its subclasses": function () {
    A.hello = 'notworld';
    assert.equal(B.hello, 'notworld');
  },
  "changing a parent's instance attributes should propagate the changes to its subclasses": function () {
    A.proto({foo: 'notbar'});
    assert.equal(b.foo, 'notbar');
  },
  'a subclass should have a reference to its superclass': function () {
    assert.equal(B.superclass, A);
  },
  'a subclass instance should know it is an instance of the subclass': function () {
    assert.ok(b.instanceOf(B));
  },
  'a subclass instance should know it is also an instance of the superclass': function () {
    assert.ok(b.instanceOf(A));
  },
  'a subclass instance should know it is not an instance of a non-ancestor': function () {
    var C = A.subclass();
    assert.ok(! b.instanceOf(C));
  },
  'an instance should have access to its class': function () {
    assert.equal(b.klass, B);
  },
  'a subclass instance should have access to its superclass': function () {
    assert.equal(b.superclass, A);
  },
  'a subclass instance method should be able to invoke the super method in the superclass': function () {
    assert.equal(b.bark('at you'), 'woof at you and quack at you');
  },
  'classes should invoke init upon instantiation': function () {
    assert.equal(animal.speak(), "animal: unknown");
    assert.equal(dog.speak(), "spot: woof");
  }
};
