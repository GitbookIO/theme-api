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
        ]
    };

    var $codes,
        currentLang;

    // function init(config) {
    //     // Instantiate font state object
    //     fontState = gitbook.storage.get('fontState', {
    //         size: config.size || 2,
    //         family: FAMILY[config.family || 'sans'],
    //         theme: THEMES[config.theme || 'white']
    //     });

    //     update();
    // }

    function toggleLayout() {
        $('.book').toggleClass('two-columns');
    }

    function updateCodes(lang) {
        var langClass = 'lang-'+lang;

        $codes.each(function() {
            // Show corresponding
            if ($(this).hasClass(langClass)) {
                $(this).removeClass('hidden');
            }
            // Hide others
            else {
                $(this).addClass('hidden');
            }
        });
    }

    gitbook.events.bind('start', function(e, config) {
        // var opts = config.fontsettings;

        // Create buttons in toolbar
        gitbook.toolbar.createButton({
            icon: 'fa fa-columns',
            label: 'Change Layout',
            onClick: toggleLayout
        });

        // Set languages in good order
        opts.languages.reverse();
        $.each(opts.languages, function(i, lang) {
            if (lang.default) {
                currentLang = lang.lang;
            }

            gitbook.toolbar.createButton({
                text: lang.name,
                position: 'right',
                className: 'lang-switcher' + (lang.default? ' active': ''),
                onClick: function(e) {
                    // Update codes
                    updateCodes(lang.lang);

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
        $codes = $('.api-method-sample');
        updateCodes(currentLang);
    });
});
