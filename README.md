## class-js - Simple OO Class factory
---

### Tutorial
To create a new class:
    var Class = require('class-js');
    var Car = Class.subclass();

You can subclass:
    var Lambo = Car.subclass();

To instantiate an object:
    var auto = Lambo.init();

You can declare instance methods when you define your subclass:
    var Animal = Class.subclass({
      init: function (name) {
        this.name = name;
      },
      introduce: function () {
        return "My name is " + this.name;
      }
    });

`init` is a special instance method that is invoked whenever you instantiate an object via Class.init(...).

You can add instance methods later on after you have defined your subclass:
    Animal.proto({
      speak: function () {
        return this.noise;
      }
    });

All instance methods are inherited by subclasses and descendants:
    var Tiger = Animal.subclass({
      init: function (name) {
        this._super(name); // this._super is a shortcut to the init method of the superclass (Animal)
        this.noise = "Growl";
      }
    });
    var cub = Tiger.init("Tony");
    cub.speak(); // => "Growl"

You can define class methods via:
    Animal.aClassMethod = function () {
      return "hola";
    };

Class methods are also inherited.
    Tiger.aClassMethod(); // => "hola"

You can access the class of an object:
    cub.klass === Tiger; // true

You can also access the superclass from the Class or instantiated Class object:
    Tiger.superclass === Animal; // true
    cub.superclass === Animal; // true
### Tests
We use the expresso library for our testing. So, first install expresso:
    npm install expresso

To run tests:
    make test

# Contributors
- [Brian Noguchi](https://github.com/bnoguchi)

### License
MIT License

---
### Author
Brian Noguchi
