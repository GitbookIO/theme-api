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
                    def,
                    codes = [],
                    tabsHeader = '',
                    tabsContent = '';

                _.each(blk.blocks, function(_blk) {
                    if (_blk.name == 'code') {
                        codes.push({
                            name: _blk.kwargs.name,
                            type: _blk.kwargs.type,
                            body: _blk.body.trim()
                        });
                    } else {
                        def = _blk.body.trim();
                    }
                });

                codes.forEach(function(code, i) {
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

                // Generate replacer
                return '<div class="api-method">'+
                            '<div class="api-method-definition">'+
                                '<h3 class="api-method-title">'+title+'</h3>'+
                                '<p>'+def+'</p>'+
                            '</div>'+
                            '<div class="api-method-code">'+
                            '<div class="codetabs">'+
                                '<div class="codetabs-header">'+tabsHeader+'</div>'+
                                '<div class="codetabs-body">'+tabsContent+'</div>'+
                            '</div>'+
                        '</div>';
            }
        }
    },

    hooks: {
        'page': function(page) {
            return page;
        }
    }
};