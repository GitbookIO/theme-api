var _ = require('lodash');
var kramed = require('kramed');
var escape = require('escape-html');
var cheerio = require('cheerio');

var examples = {};

module.exports = {
    book: {
        assets: './assets',
        js: [
            'theme-api.js'
        ]
    },

    blocks: {
        example: {
            parse: false,
            blocks: ['sample', 'common'],
            process: function(blk) {
                // Store methods for page
                var samples = [],
                    exampleName = blk.kwargs.name;

                _.each(blk.blocks, function(_blk) {
                    samples.push({
                        name: _blk.name,
                        body: _blk.body.trim(),
                        lang: _blk.kwargs.lang
                    });
                });

                // Add to list of methods
                if (!!exampleName) {
                    examples[exampleName] = samples;
                }

                return '<div id="'+exampleName+'"></div>';
            }
        }
    },

    hooks: {
        'page': function(page) {
            // Replace each method with examples content
            var $ = cheerio.load(page.content);

            var example;
            for (example in examples) {
                // Method is on current page
                var $exampleTitle = $('#'+example);

                if ($exampleTitle.length) {
                    var $prev = $exampleTitle.prev();

                    // Add class to title to prevent margin
                    $exampleTitle.addClass('api-method-title');

                    // Create definition from method content
                    var $exampleHTML = $('<div class="api-method"></div>');

                    var $exampleContent = $exampleTitle.nextUntil(':header').addBack();
                    var $container = $('<div></div>');

                    $exampleContent.each(function() {
                        $container.append($(this));
                    });

                    var $exampleDefinition = $('<div class="api-method-definition"></div>');
                    $exampleDefinition.html($container.html());

                    $exampleHTML.append($exampleDefinition);

                    // Generate code examples from parsed blocks
                    var $exampleCode = $('<div class="api-method-code"></div>');

                    var samples = examples[example];
                    _.each(samples, function(sample) {
                        // Common text
                        if (sample.name == 'common') {
                            var $common = $('<div class="api-method-example"></div>');
                            $common.html(kramed(sample.body));
                            $exampleCode.append($common);
                        }

                        // Example code snippets
                        if (sample.name == 'sample') {
                            var langClass = 'lang-'+sample.lang;
                            var $code = $('<div class="api-method-sample '+langClass+'"></div>');
                            $code.html(kramed(sample.body));
                            $exampleCode.append($code);
                        }
                    });

                    // Append code to method div
                    $exampleHTML.append($exampleCode);

                    // Replace content
                    $exampleHTML.insertAfter($prev);
                }
            }

            page.content = $.html();
            return page;
        }
    }
};