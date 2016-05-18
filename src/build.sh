#! /bin/bash

# Cleanup folder
rm -rf assets

# Recreate folder
mkdir -p assets

# Compile JS
browserify src/js/theme-api.js | uglifyjs -mc > assets/theme-api.js

# Compile Website CSS
lessc -clean-css src/less/website.less assets/theme-api.css