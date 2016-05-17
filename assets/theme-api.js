require(['gitbook', 'jquery'], function(gitbook, $) {
    var opts = {
        languages: [
            {
                name: 'JavaScript',
                lang: 'js',
                default: true
            },
            {
                name: 'Go',
                lang: 'go'
            }
        ],
        hideCodeTabs: false
    };

    function init(config) {
        // Instantiate font state object
        fontState = gitbook.storage.get('fontState', {
            size: config.size || 2,
            family: FAMILY[config.family || 'sans'],
            theme: THEMES[config.theme || 'white']
        });

        update();
    }

    function toggleLayout() {
        $('.book').toggleClass('two-columns');
    }

    var $codetabs;
    function updateCodeTabs(lang) {
        $codetabs.each(function() {
            // Switch only codetabs with corresponding language
            var newTab = $(this).find('.tab[data-codetab="' + lang + '"]');

            if (!!newTab.length) {
                $(this).find('.tab').removeClass('active');
                newTab.addClass('active');
            }
        });
    }

    gitbook.events.bind('start', function(e, config) {
        // var opts = config.fontsettings;

        // Create buttons in toolbar
        gitbook.toolbar.createButton({
            icon: 'fa fa-columns',
            label: 'Change Layout',
            className: 'font-settings',
            onClick: toggleLayout
        });

        // Create buttons in toolbar
        // gitbook.toolbar.createButton({
        //     icon: 'fa fa-code',
        //     label: 'Language',
        //     className: 'font-settings',
        //     dropdown: $.map(languages, function(lang) {
        //         return {
        //             text: lang.name,
        //             onClick: function() {
        //                 updateCodeTabs(lang.lang);
        //             }
        //         };
        //     })
        // });

        // Set languages in good order
        opts.languages.reverse();
        $.each(opts.languages, function(i, lang) {
            gitbook.toolbar.createButton({
                text: lang.name,
                position: 'right',
                className: 'lang-switcher' + (lang.default? ' active': ''),
                onClick: function(e) {
                    // Update codes
                    updateCodeTabs(lang.lang);

                    // Update active button
                    $('.btn.lang-switcher').removeClass('active');
                    $(e.currentTarget).addClass('active');
                }
            });
        });

        // Init current settings
        // init(opts);
    });

    gitbook.events.on('page.change', function() {
        $codetabs = $('.codetabs');

        // Hide tab headers if asked
        if (opts.hideCodeTabs) {
            $codetabs.find('.codetabs-header').addClass('hidden');
        }

        // Sync language change for codetabs
        $(document).on('click.plugin.codetabs', '.codetabs .codetabs-header .tab', function(e) {
            var $btn = $(e.target);
            var tabId = $btn.data('codetab');

            $codetabs.each(function() {
                $(this).find('.tab').removeClass('active');
                $(this).find('.tab[data-codetab="' + tabId + '"]').addClass('active');
            });
        });
    });
});
