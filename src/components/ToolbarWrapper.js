const GitBook    = require('gitbook-core');
const { React }  = GitBook;
const { Sticky } = require('react-sticky');

const ToolbarWrapper = React.createClass({
    propTypes: {
        children: React.PropTypes.node.isRequired
    },

    render() {
        return (
            <Sticky className="ThemeApi-Toolbar">
                {this.props.children}
            </Sticky>
        );
    }
});

module.exports = ToolbarWrapper;
