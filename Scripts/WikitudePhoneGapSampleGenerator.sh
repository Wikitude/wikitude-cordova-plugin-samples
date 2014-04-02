#!/bin/sh
#
#  Wikitude_PhoneGap_Sample_Generator.sh
#
#  Created by Wikitude GmbH on 03/26/14.
#
#

set -e

PROJECT_DIRECTORY=$1
PROJECT_ID=$2
PROJECT_NAME=$3

BUILD_IOS=$4
BUILD_ANDROID=$5

SOURCE_DIRECTORY=$6
DESTINATION_DIRECTORY="$PROJECT_DIRECTORY/www"



## Run some checks if we can proceed...
if [ -d $PROJECT_DIRECTORY ]; then
	echo "Project directory already exists"
	exit 1
fi


## Generate sample project ##
echo "*** GENERATING PROJECT ***"

# Create the project directory
phonegap create $PROJECT_DIRECTORY $PROJECT_ID $PROJECT_NAME

# Step into the created project directory
cd $PROJECT_DIRECTORY


## Copy all sample relevant resources ##
echo "*** PREPARING SAMPLE CONTENT ***"

# copy css
cp -R $SOURCE_DIRECTORY/css/* $DESTINATION_DIRECTORY/css

# copy jquery
cp -R $SOURCE_DIRECTORY/jquery $DESTINATION_DIRECTORY

# copy js
cp -R $SOURCE_DIRECTORY/js/* $DESTINATION_DIRECTORY/js/*

# add samples
cp -R $SOURCE_DIRECTORY/world $DESTINATION_DIRECTORY/

# copy index.html
cp -R $SOURCE_DIRECTORY/index.html $DESTINATION_DIRECTORY/index.html


## Build sample app
echo "*** BUILDING SAMPLE APP ***"

if [ "true" == "$BUILD_IOS" ]; then
	echo "iOS"
	phonegap build ios
fi
if [ "true" == "$BUILD_ANDROID" ]; then
	echo "Android"
	phonegap build android
fi


## Add Wikitude plugin
echo "*** ADDING WIKITUDE PLUGIN ***"
phonegap plugin add https://github.com/Wikitude/wikitude-phonegap.git


echo "*** DONE - SUCCESS ***"
