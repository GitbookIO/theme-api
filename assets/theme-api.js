require(['gitbook', 'jquery'], function(gitbook, $) {
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

    gitbook.events.bind('start', function(e, config) {
        var opts = config.fontsettings;

        // Create buttons in toolbar
        gitbook.toolbar.createButton({
            icon: 'fa fa-columns',
            label: 'Change Layout',
            className: 'font-settings',
            onClick: toggleLayout
        });


        // Init current settings
        // init(opts);
    });

    gitbook.events.on('page.change', function() {
        var $codetabs = $('.codetabs');

        // Sync language change for codetabs
        $(document).on('click.plugin.codetabs', '.codetabs .codetabs-header .tab', function(e) {
            var $btn = $(e.target);
            var tabId = $btn.data('codetab');

            $codetabs.each(function() {
                var $tabs = $btn.parents('.codetabs');
                $(this).find('.tab').removeClass('active');
                $(this).find('.tab[data-codetab="' + tabId + '"]').addClass('active');
            });
        });
    });
});
