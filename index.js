'use strict';

var Literalz = require('literalz');

var converters = require('./converters');

function compile(expression, options) {
    var predicate;

    options = options || {};

    if (expression) {
        if (options.syntax) {
            var converter = converters[options.syntax];
            if (!converter) {
                throw new ReferenceError('Syntax converter ' + options.syntax + ' not defined.');
            }
            expression = converter(expression);
        }

        // Following will through SyntaxError on bad expression
        predicate = new Function('domain', 'with(domain){return (' + expression + ')}');

        if (options.keys) {
            throwErrorOnUndefinedColumnName(options.keys, expression);
        }
    }

    return predicate;
}

// Throws ReferenceError on unknown variable (including global object and properties thereof)
function throwErrorOnUndefinedColumnName(keys, expression) {
    var regexRefs = /([a-zA-Z$_][\w$]+)(\s*\.\s*[a-zA-Z$_][\w$]+)*/g, // identifier[.identifier]...
        extract = (new Literalz(expression)).extract, // empty out the literals
        parts, variable;

    keys = keys.concat(['true', 'false']);

    // search for variable references, excluding property references (with dot operator prefix)
    while ((parts = regexRefs.exec(extract))) {
        variable = parts[1];
        if (keys.indexOf(variable) < 0) {
            throw new ReferenceError(variable + ' not defined.');
        }
    }
}

module.exports = {
    compile: compile,
    converters: converters
};
