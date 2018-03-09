'use strict';

var Literalz = require('literalz');

var converters = require('./converters');

function compile(expression, options) {
    var predicate;

    if (expression) {
        var literalz = new Literalz(expression);

        options = options || {};

        // convert expression to JavaScript syntax
        if (options.syntax) {
            var converter = converters[options.syntax];
            if (!converter) {
                throw new ReferenceError('Syntax converter ' + options.syntax + ' not defined.');
            }
            expression = converter(literalz).inject();
        }

        // Check expression for assignment operator
        if (!options.assignments) {
            throwErrorOnAssign(literalz.extract)
        }

        // Check expression for reference errors
        if (options.keys) {
            throwErrorOnUndefinedColumnName(options.keys, literalz.extract);
        }

        // Following will throw SyntaxError on bad expression
        predicate = new Function('domain', 'with(domain){return (' + expression + ')}');
    }

    return predicate;
}

// Throws ReferenceError on unknown variable (including global object and properties thereof)
function throwErrorOnUndefinedColumnName(keys, extract) {
    var regexRefs = /([a-zA-Z$_][\w$]+)(\s*\.\s*[a-zA-Z$_][\w$]+)*/g, // identifier[.identifier]...
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

function throwErrorOnAssign(extract) {
    if (/[^<>!=]=[^=]/.test(extract)) {
        throw new SyntaxError('Unexpected assignment operator in expression.');
    }
}

module.exports = {
    compile: compile,
    converters: converters
};
