const GitBook          = require('gitbook-core');
const BodyWrapper      = require('./components/BodyWrapper');
const ToolbarWrapper   = require('./components/ToolbarWrapper');
const MethodBlock      = require('./components/MethodBlock');
const PageContainer    = require('./components/PageContainer');
const DisplayButton    = require('./components/DisplayButton');
const LanguagesButtons = require('./components/LanguagesButtons');

const actions = require('./actions');
const reduce  = require('./reducers');

module.exports = GitBook.createPlugin({
    activate: (dispatch, getState, { Components }) => {
        dispatch(Components.registerComponent(BodyWrapper, { role: 'body:wrapper' }));
        dispatch(Components.registerComponent(ToolbarWrapper, { role: 'toolbar:wrapper' }));
        dispatch(Components.registerComponent(MethodBlock, { role: 'block:method' }));
        dispatch(Components.registerComponent(PageContainer, { role: 'page:container' }));
        dispatch(Components.registerComponent(DisplayButton, { role: 'toolbar:buttons:left' }));
        dispatch(Components.registerComponent(LanguagesButtons, { role: 'toolbar:buttons:right' }));

        // Get default language in config
        const configLanguages = getState().config.getIn(['pluginsConfig', 'theme-api', 'languages']);
        let defaultLanguage = configLanguages.find((language) => {
            return Boolean(language.get('default'));
        });

        // Or use first language in list
        if (!defaultLanguage) {
            defaultLanguage = configLanguages.get(0);
        }

        // Set as selected language
        dispatch(actions.selectLanguage(defaultLanguage.get('lang')));
    },
    reduce,
    actions: {
        ThemeApi: actions
    }
});
