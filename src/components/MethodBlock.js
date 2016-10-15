const GitBook = require('gitbook-core');
const { React } = GitBook;

const exampleShape = React.PropTypes.shape({
    type:     React.PropTypes.string.isRequired,
    content:  React.PropTypes.string,
    language: React.PropTypes.string,
    name:     React.PropTypes.string
});

const ApiCommon = React.createClass({
    propTypes: {
        content: React.PropTypes.string
    },

    render() {
        const { content } = this.props;
        return (
            <div className="ThemeApi-ApiMethodExample">
                <GitBook.HTMLContent html={content} />
            </div>
        );
    }
});

const ApiSample = React.createClass({
    propTypes: {
        example:          exampleShape,
        selectedLanguage: React.PropTypes.string
    },

    render() {
        const { example, selectedLanguage } = this.props;
        // Don't display if is not selected language
        if (selectedLanguage != example.language) {
            return null;
        }

        return (
            <div className="ThemeApi-ApiMethodSample" data-language={example.language} data-name={example.name}>
                <GitBook.HTMLContent html={example.content} />
            </div>
        );
    }
});

const ApiExample = React.createClass({
    propTypes: {
        example:        exampleShape,
        selectedLanguage: React.PropTypes.string
    },

    render() {
        const { example } = this.props;

        if (example.type == 'common') {
            return <ApiCommon content={example.content} />;
        }
        else {
            return <ApiSample {...this.props} />;
        }
    }
});

const MethodBlock = React.createClass({
    propTypes: {
        definition:       React.PropTypes.string,
        examples:         React.PropTypes.arrayOf(exampleShape),
        selectedLanguage: React.PropTypes.string
    },

    render() {
        const { definition, examples, selectedLanguage } = this.props;

        return (
            <div className="ThemeApi-ApiMethod">
                <div className="ThemeApi-ApiMethodDefinition">
                    <GitBook.HTMLContent html={definition} />
                </div>
                <div className="ThemeApi-ApiMethodCode">
                    { examples.map((example, i) => <ApiExample key={i} example={example} selectedLanguage={selectedLanguage} />) }
                </div>
            </div>
        );
    }
});

function mapStateToProps({ themeApi }) {
    return {
        selectedLanguage: themeApi.get('selectedLanguage')
    };
}

module.exports = GitBook.connect(MethodBlock, mapStateToProps);
