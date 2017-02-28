const GitBook   = require('gitbook-core');
const { React } = GitBook;

const toggleDisplayMode = require('../actions').toggleDisplayMode;

const DisplayButton = React.createClass({
    propTypes: {
        dispatch: React.PropTypes.func.isRequired
    },

    onClick() {
        const { dispatch } = this.props;
        dispatch(toggleDisplayMode());
    },

    render() {
        return (
            <GitBook.Button onClick={this.onClick}>
                <GitBook.Icon id="columns" />
            </GitBook.Button>
        );
    }
});

module.exports = GitBook.connect(DisplayButton);
