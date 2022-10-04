#!/usr/bin/env bash

CURRENT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

export PACKAGE_DIRS=$CURRENT_DIR/packages:$

export PACKAGE_DIRS='/Users/branavan/NimbusPOS/Meteor App/packages'

export MONGO_URL=mongodb://maestro-uat:49eHDAwgrfvV@ds019063.mlab.com:19063/maestro-uat