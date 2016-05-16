var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var uuid = require('node-uuid');
var kramed = require('kramed');
var escape = require('escape-html');
var cheerio = require('cheerio');

function createTab(code, i, isActive) {
    return '<div class="tab' + (isActive? ' active' : '') + '" data-codetab="' + code.type + '">' + code.name + '</div>';
}

function createTabBody(code, i, isActive) {
    return '<div class="tab' + (isActive? ' active' : '') + '" data-codetab="' + code.type + '"><pre><code class="lang-' + code.type + '">'
        + escape(code.body) +
    '</code></pre></div>';
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
            blocks: ['def', 'example', 'code'],
            process: function(blk) {
                var title = blk.body.trim(),
                    def;

                var lastCode = false;
                var result = _.reduce(blk.blocks, function(acc, curr) {
                    if (curr.name == 'def') {
                        def = curr.body.trim();

                        lastCode = false;
                        return acc;
                    }

                    if (curr.name == 'example') {
                        var elem = {
                            type: 'example',
                            text: curr.body.trim()
                        };
                        acc.push(elem);

                        lastCode = false;
                        return acc;
                    }

                    if (curr.name == 'code') {
                        var code = {
                            name: curr.kwargs.name,
                            type: curr.kwargs.type,
                            body: curr.body.trim()
                        };

                        if (!code.name) {
                            throw new Error('Code tab requires a "name" property');
                        }
                        if (!code.type) {
                            throw new Error('Code tab requires a "type" property');
                        }

                        if (lastCode) {
                            var elem = acc.pop();

                            elem.codes.push(code);
                            acc.push(elem);
                        } else {
                            var elem = {
                                type: 'code',
                                codes: [code]
                            };
                            acc.push(elem);
                        }

                        lastCode = true;
                        return acc;
                    }
                }, []);

                var html = '<div class="api-method">'+
                            '<div class="api-method-definition">'+
                                '<h3 class="api-method-title">'+title+'</h3>'+
                                '<p>'+def+'</p>'+
                            '</div>'+
                            '<div class="api-method-code">';

                // Generate div.api-method-code
                _.each(result, function(elem) {
                    // Is an example text
                    if (elem.type == 'example') {
                        html += '<div class="api-method-example"><p>'+elem.text+'</p></div>';
                    }

                    // Is a code example
                    if (elem.type == 'code') {
                        var tabsHeader = '',
                            tabsContent = '';

                        _.each(elem.codes, function(code, i) {
                            var isActive = (i == 0);

                            if (!code.name) {
                                throw new Error('Code tab requires a "name" property');
                            }
                            if (!code.type) {
                                throw new Error('Code tab requires a "type" property');
                            }

                            tabsHeader += createTab(code, i, isActive);
                            tabsContent += createTabBody(code, i, isActive);
                        });

                        html += '<div class="codetabs">'+
                                    '<div class="codetabs-header">'+tabsHeader+'</div>'+
                                    '<div class="codetabs-body">'+tabsContent+'</div>'+
                                '</div>';
                    }
                });

                // Close div.api-method-code
                html += '</div>';

                // Generate replacer
                return html;
            }
        }
    },

    hooks: {
        'page': function(page) {
            return page;
        }
    }
};