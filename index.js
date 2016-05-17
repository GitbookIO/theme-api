var _ = require('lodash');
var kramed = require('kramed');
var cheerio = require('cheerio');

function generateMethod(body, examples) {
    // Main container
    var $ = cheerio.load('<div class="api-method"></div>'),
        $apiMethod = $('div.api-method'),
    // Method definition
        $apiDefinition = $('<div class="api-method-definition"></div>'),
    // Method code
        $apiCode = $('<div class="api-method-code"></div>');

    // Append elements
    $apiMethod.append($apiDefinition);
    $apiMethod.append($apiCode);

    // Set method body
    $apiDefinition.html(kramed(body));

    // Set method examples
    _.each(examples, function(example) {
        // Common text
        if (example.name == 'common') {
            var $common = $('<div class="api-method-example"></div>');
            $common.html(kramed(example.body));
            $apiCode.append($common);
        }

        // Example code snippets
        if (example.name == 'sample') {
            var langClass = 'lang-'+example.lang;
            var $code = $('<div class="api-method-sample '+langClass+'"></div>');
            $code.html(kramed(example.body));
            $apiCode.append($code);
        }
    });

    // Return whole HTML
    return $.html('div.api-method');
}

module.exports = {
    book: {
        assets: './assets',
        js: [
            'theme-api.js'
        ]
    },

    blocks: {
        method: {
            parse: true,
            blocks: ['sample', 'common'],
            process: function(blk) {
                var examples = [];

                _.each(blk.blocks, function(_blk) {
                    examples.push({
                        name: _blk.name,
                        body: _blk.body.trim(),
                        lang: _blk.kwargs.lang
                    });
                });

                return generateMethod(blk.body.trim(), examples);
            }
        }
    }
};