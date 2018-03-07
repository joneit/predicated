'use strict';

var Literalz = require('literalz');

// converts traditional expression syntax to JavaScript

module.exports = function(s) {
    return (new Literalz(s))
        .replace(/\band\b/gi, '&&')
        .replace(/\bor\b/gi, '||')
        .replace(/\bnot\b/gi, '!')
        .replace(/([^<>!=])=([^=])/g, '$1===$2')
        .replace(/<>/g, '!==')
        .inject();
};
