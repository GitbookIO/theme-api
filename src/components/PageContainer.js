const GitBook    = require('gitbook-core');
const { React }  = GitBook;
const classNames = require('classnames');

const PageContainer = React.createClass({
    propTypes: {
        page:  GitBook.PropTypes.Page,
        split: React.PropTypes.bool
    },

    render() {
        const { page, split } = this.props;

        const className = classNames({
            'ThemeApi-TwoColumns': split
        });

        return (
            <div className={className}>
                <GitBook.ImportCSS href="gitbook/theme-api/theme-api.css" />
                <GitBook.HTMLContent html={page.content} />
            </div>
        );
    }
});

function mapStateToProps({ themeApi, page }) {
    return {
        split: themeApi.get('split'),
        page
    };
}

module.exports = GitBook.connect(PageContainer, mapStateToProps);
