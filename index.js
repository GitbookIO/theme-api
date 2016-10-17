var _       = require('lodash');
var Promise = require('q-plus');

var DEFAULT_LANGUAGES = require('./languages');
var configLanguages = [];

module.exports = {
    blocks: {
        method: {
            blocks: [ 'sample', 'common' ],
            process: function(block) {
                var book     = this;
                var examples = [];

                return Promise(block.blocks).eachSeries(function(_block) {
                    var languageName;

                    // Search if is user-defined language
                    if (_block.name == 'sample') {
                        // Sample blocks should have a lang argument
                        if (!_block.kwargs.lang) {
                            throw Error('sample blocks must provide a "lang" argument');
                        }

                        var language = _.find(configLanguages, { lang: _block.kwargs.lang });

                        if (!!language) {
                            languageName = language.name;
                        } else {
                            // Default to upper-cased lang
                            languageName = _block.kwargs.lang.toUpperCase();
                        }
                    }

                    return book.renderBlock('markdown', _block.children.trim())
                    .then(function(content) {
                        examples.push({
                            type:     _block.name,
                            content:  content,
                            language: _block.kwargs.lang,
                            name:     languageName
                        });
                    });
                })
                .then(function() {
                    return book.renderBlock('markdown', block.children.trim())
                    .then(function(definition) {
                        return {
                            definition: definition,
                            examples:   examples
                        };
                    });
                });
            }
        }
    },

    hooks: {
        config: function(config) {
            // Merge user configured languages with default languages
            configLanguages = _.unionBy(config.pluginsConfig['theme-api'].languages, DEFAULT_LANGUAGES, 'lang');
            return config;
        }
    }
};
