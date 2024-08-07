#!/bin/bash


# Define the version increment type (e.g., patch, minor, major)
VERSION_TYPE=${1:-patch}

OUTPUT_DIR="compiled/"
if [ ! -d "$OUTPUT_DIR" ]; then
	mkdir "$OUTPUT_DIR"
fi

# Move the .vsix file to the specified folder
# Increment version in package.json
npm version $VERSION_TYPE -m "Bump version to %s" && npm run compile && vsce package && LATEST_VSIX=$(ls *.vsix | sort -V | tail -n 1) && mv "$LATEST_VSIX" "$OUTPUT_DIR/" && echo "Compiled" 