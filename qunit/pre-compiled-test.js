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
