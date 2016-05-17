var _ = require('lodash');
var kramed = require('kramed');
var escape = require('escape-html');
var cheerio = require('cheerio');

function createTab(code, i, isActive) {
    return '<div class="tab' + (isActive? ' active' : '') + '" data-codetab="' + code.lang + '">' + code.name + '</div>';
}

function createTabBody(code, i, isActive) {
    return '<div class="tab' + (isActive? ' active' : '') + '" data-codetab="' + code.lang + '"><pre><code class="lang-' + code.lang + '">'
        + escape(code.body) +
    '</code></pre></div>';
}

var methods = {};

module.exports = {
    book: {
        assets: './assets',
        js: [
            'theme-api.js'
        ]
    },

    blocks: {
        method: {
            parse: false,
            blocks: ['code', 'example'],
            process: function(blk) {
                // Store methods for page
                var examples = [],
                    currentExample = {
                        text: blk.body.trim(),
                        codes: []
                    };

                _.each(blk.blocks, function(_blk) {
                    // Current example
                    if (_blk.name == 'code') {
                        var code = {
                            name: _blk.kwargs.name,
                            lang: _blk.kwargs.lang,
                            body: _blk.body.trim()
                        };

                        currentExample.codes.push(code);
                    }

                    // New example
                    if (_blk.name == 'example') {
                        // Push last example
                        examples.push(_.cloneDeep(currentExample));

                        currentExample.text = _blk.body.trim();
                        currentExample.codes = [];
                    }
                });

                // Push last example
                examples.push(currentExample);

                // Add to list of methods
                if (!!blk.kwargs.name) {
                    methods[blk.kwargs.name] = examples;
                }

                return '<div id="'+blk.kwargs.name+'"></div>';
            }
        }
    },

    hooks: {
        'page': function(page) {
            // Replace each method with examples content
            var $ = cheerio.load(page.content);

            var method;
            for (method in methods) {
                // Method is on current page
                var $methodTitle = $('#'+method);

                if ($methodTitle.length) {
                    var $prev = $methodTitle.prev();

                    // Create definition from method content
                    var $methodHTML = $('<div class="api-method"></div>');

                    var $methodContent = $methodTitle.nextUntil(':header').addBack();
                    var $container = $('<div></div>');

                    $methodContent.each(function() {
                        $container.append($(this));
                    });

                    var $methodDefinition = $('<div class="api-method-definition"></div>');
                    $methodDefinition.html($container.html());

                    $methodHTML.append($methodDefinition);

                    // Generate code examples from parsed blocks
                    var $methodCode = $('<div class="api-method-code"></div>');

                    var examples = methods[method];
                    _.each(examples, function(example) {
                        // Example text
                        if (!!example.text.trim().length) {
                            var $methodExample = $('<div class="api-method-example"></div>');
                            $methodExample.html(kramed(example.text));
                            $methodCode.append($methodExample);
                        }

                        // Example code snippets
                        if (!!example.codes.length) {
                            var tabsHeader = '',
                                tabsContent = '';

                            _.each(example.codes, function(code, i) {
                                var isActive = (i == 0);

                                tabsHeader += createTab(code, i, isActive);
                                tabsContent += createTabBody(code, i, isActive);
                            });

                            var $codeTabs = $('<div class="codetabs"></div>');
                            var $tabsHeader = $('<div class="codetabs-header"></div>');
                            $tabsHeader.html(tabsHeader);

                            var $tabsContent = $('<div class="codetabs-body"></div>');
                            $tabsContent.html(tabsContent);

                            $codeTabs.append($tabsHeader);
                            $codeTabs.append($tabsContent);

                            $methodCode.append($codeTabs);
                        }
                    });

                    // Append code to method div
                    $methodHTML.append($methodCode);

                    // Replace content
                    $methodHTML.insertAfter($prev);
                }
            }

            page.content = $.html();
            return page;
        }
    }
};