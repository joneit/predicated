'use strict';

// converts traditional expression syntax to JavaScript

module.exports = function(literalz) {
    return literalz
        .replace(/\band\b/gi, '&&')
        .replace(/\bor\b/gi, '||')
        .replace(/\bnot\b/gi, '!')
        .replace(/([^<>!=])=([^=])/g, '$1===$2')
        .replace(/<>/g, '!==');
};
