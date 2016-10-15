const GitBook    = require('gitbook-core');
const { React }  = GitBook;
const { List }   = GitBook.Immutable;
const classNames = require('classnames');

const languageShape = React.PropTypes.shape({
    lang:    React.PropTypes.string.isRequired,
    name:    React.PropTypes.string.isRequired,
    default: React.PropTypes.bool
});

const LanguageButton = React.createClass({
    propTypes: {
        language: languageShape,
        active:   React.PropTypes.bool
    },

    render() {
        const { language, active } = this.props;

        const className = classNames('ThemeApi-LanguageButton', {
            'ThemeApi-ActiveButton': active
        });

        return (
            <GitBook.Button className={className} onClick={this.onClick}>
                { language.name }
            </GitBook.Button>
        );
    }
});

const LanguagesButtons = React.createClass({
    propTypes: {
        languages:        React.PropTypes.arrayOf(languageShape).isRequired,
        selectedLanguage: React.PropTypes.string.isRequired
    },

    render() {
        const { languages, selectedLanguage } = this.props;
        return (
            <GitBook.ButtonGroup>
                { languages.map((language, i) => <LanguageButton key={i} language={language} active={language.lang == selectedLanguage} />) }
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
