const GitBook = require('gitbook-core');
const { Record } = GitBook.Immutable;

const ACTIONS_TYPES = require('../actions/types');

const ThemeApiState = Record({
    // current displayed language
    selectedLanguage: String(''),
    // split display
    split: Boolean(true)
});

module.exports = (state = ThemeApiState(), action) => {
    switch (action.type) {

    case ACTIONS_TYPES.SELECT_LANGUAGE:
        return state.set('selectedLanguage', action.language);

    case ACTIONS_TYPES.TOGGLE_DISPLAY_MODE:
        return state.set('split', !state.get('split'));

    default:
        return state;
    }
};
