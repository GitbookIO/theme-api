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
        example: exampleShape
    },

    render() {
        const { example } = this.props;
        return (
            <div className="ThemeApi-ApiMethodSample" data-lang={example.lang} data-name={example.name}>
                <GitBook.HTMLContent html={example.content} />
            </div>
        );
    }
});

const ApiExample = React.createClass({
    propTypes: {
        example: exampleShape
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
        definition: React.PropTypes.string,
        examples:   React.PropTypes.arrayOf(exampleShape)
    },

    render() {
        const { definition, examples } = this.props;

        return (
            <div className="ThemeApi-ApiMethod">
                <GitBook.ImportCSS href="gitbook/theme-api/theme-api.css" />
                <div className="ThemeApi-ApiMethodDefinition">
                    <GitBook.HTMLContent html={definition} />
                </div>
                <div className="ThemeApi-ApiMethodCode">
                    { examples.map((example, i) => <ApiExample key={i} example={example} />) }
                </div>
            </div>
        );
    }
});

module.exports = GitBook.createPlugin({
    activate: (dispatch, getState, { Components }) => {
        dispatch(Components.registerComponent(MethodBlock, { role: 'block:method' }));
    }
});
