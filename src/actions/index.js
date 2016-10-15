const ACTIONS_TYPES = require('./types');

/**
 * Change language from toolbar
 * @return {Action}
 */
function selectLanguage(language) {
    return {
        type: ACTIONS_TYPES.SELECT_LANGUAGE,
        language
    };
}

/**
 * Toggle split display mode
 */
function toggleDisplayMode() {
    return {
        type: ACTIONS_TYPES.TOGGLE_DISPLAY_MODE
    };
}

module.exports = {
    selectLanguage,
    toggleDisplayMode
};
