#! /bin/bash

echo "Cleaning up folder..."
# Cleanup folder
rm -rf _assets/website

# Recreate folder
mkdir -p _assets/website

echo "Compiling LESS sources..."
# Compile Website CSS
lessc -clean-css src/less/website.less _assets/website/theme-api.css

echo "Done :)"
