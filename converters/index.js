'use strict';

module.exports = {

    javascript: function(expression) {
        return expression;
    },

    traditional: require('./SQL-to-JS.js')

};
