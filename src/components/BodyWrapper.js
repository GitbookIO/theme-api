const GitBook             = require('gitbook-core');
const { React }           = GitBook;
const { StickyContainer } = require('react-sticky');

const BodyWrapper = React.createClass({
    propTypes: {
        children: React.PropTypes.node.isRequired
    },

    render() {
        return (
            <StickyContainer>
                {this.props.children}
            </StickyContainer>
        );
    }
});

module.exports = BodyWrapper;
