#!/bin/sh

# exit if any subcommand returns a non-zero status
set -e

FILE=$1

sed -i -e "s@config.REACT_APP_BASE_URL@$REACT_APP_BASE_URL@g" $FILE