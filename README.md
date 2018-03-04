# predicated
Create a predicate function from an expression

### Usage

```js
var compile = require('predicated').compile;
var predicate = compile('a === 1');
console.log(predicate({ a: 1 })); // true
console.log(predicate({ a: 2 })); // false
```

### Options

There are two options:

#### `keys`

To check for `ReferenceError` at compile time:
```js
domain = { a: 2 };
var options = { keys: Object.keys(domain) };
predicate = compile('a === 1 && b === 2', options); // ReferenceError: b is not defined
```
Checking for `ReferenceError`s  at compile time guarantees they will not occur at run time (_i.e., predicate test time). It is also more reliable because all given keys are checked at compile time, whereas at run time `ReferenceError`s may _or may not_ occur depending on the expression logic which may not evaluate all the variables in the expression (_e.g.,_ [short-circuit evaluation](https://en.wikipedia.org/wiki/Short-circuit_evaluation)). The predicate test after the `delete` in the [`compile`](#compile-function) example below illustrates this problem.

#### `syntax`

To invoke a [syntax converter](#converters-collection):
```js
domain = { number_of_pets: 5, employed: false };
expression = 'number_of_pets < 3 and not employed';
predicate = compile(expression); // SyntaxError: Unexpected identifierFilter

predicate = compile(expression, { syntax: 'traditional' });
console.log(predicate(domain)); // true
```
Note that converters are not necessarily syntax checkers; they merely have to recognize syntax sufficiently to make the conversion.


### API

#### `compile` function

```js
var compile = require('predicated').compile;

var expression = 'number_of_pets < 3 || !employed';
var predicate = compile(expression);

var domain = { number_of_pets: 5, employed: false };
console.log(predicate(domain)); // true

domain.employed = true;
console.log(predicate(domain)); // false

domain.number_of_pets = 2;
console.log(predicate(domain)); // true

delete domain.employed;
console.log(predicate(domain)); // still true because left operand of `||` is true

domain.number_of_pets = 5;
console.log(predicate(domain)); // ReferenceError: employed is not defined
```

#### `converters` collection

Syntax converters are functions that take an expression with foreign syntax and return an equivalent JavaScript expression.

To invoke a syntax converter, pass a converter name in the [`syntax` option](#syntax) to `compile()`.

##### Pre-packaged converters
```js
var converters = require('predicated').converters;
console.log(Object.keys(converters)); // ['javascript', 'traditional']
```

The `javascript` converter is just a no-op (pass-through function).

The `traditional` converter converts syntax such as used in VB expressions or SQL where-clause expressions to JavaScript expression syntax. Specifically, it just searches for the following tokens outside of string literals and replaces them replaces them with JavaScript tokens:
   * `and` is replaced with `&&`
   * `or` is replaced with `||`
   * `not` is replaced with `!`
   * `=` is replaced with `===`
   * `<>` is replaced with `!==`

##### Custom converters
To add custom syntax converters:
```js
converters.rpn = function(expression) {

    // interesting code goes here to read reverse polish
    // notation and output a JavaScript expression

    return expression;
}
```