const GitBook        = require('gitbook-core');
const { React }      = GitBook;
const { List }       = GitBook.Immutable;
const classNames     = require('classnames');
const selectLanguage = require('../actions').selectLanguage;

const languageShape = React.PropTypes.shape({
    lang:    React.PropTypes.string.isRequired,
    name:    React.PropTypes.string.isRequired,
    default: React.PropTypes.bool
});

const LanguageButton = React.createClass({
    propTypes: {
        language: languageShape.isRequired,
        active:   React.PropTypes.bool,
        onClick:  React.PropTypes.func.isRequired
    },

    render() {
        const { language, active, onClick } = this.props;

        const className = classNames('ThemeApi-LanguageButton', {
            'ThemeApi-ActiveButton': active
        });

        return (
            <GitBook.Button className={className} onClick={() => onClick(language.lang)}>
                { language.name }
            </GitBook.Button>
        );
    }
});

const LanguagesButtons = React.createClass({
    propTypes: {
        dispatch:         React.PropTypes.func.isRequired,
        languages:        React.PropTypes.arrayOf(languageShape).isRequired,
        selectedLanguage: React.PropTypes.string.isRequired
    },

    onButtonClick(language) {
        const { dispatch } = this.props;
        dispatch(selectLanguage(language));
    },

    render() {
        const { languages, selectedLanguage } = this.props;
        return (
            <GitBook.ButtonGroup>
                { languages.map((language, i) => <LanguageButton key={i} onClick={this.onButtonClick} language={language} active={language.lang == selectedLanguage} />) }
            </GitBook.ButtonGroup>
        );
    }
});

function mapStateToProps({ config, themeApi }) {
    return {
        languages:        config.getIn(['pluginsConfig', 'theme-api', 'languages'], List()).toJS(),
        selectedLanguage: themeApi.get('selectedLanguage')
    };
}

module.exports = GitBook.connect(LanguagesButtons, mapStateToProps);
