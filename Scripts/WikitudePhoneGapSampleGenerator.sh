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

USE_PLUGIN_SOURCE=false

if [ "$#" -eq 7 ]; then
	USE_PLUGIN_SOURCE=true
	PLUGIN_SOURCE=$7
fi


## Run some checks if we can proceed...
if [ -d $PROJECT_DIRECTORY ]; then
	echo "Project directory already exists"
	exit 1
fi


## Generate sample project ##
echo "*** GENERATING PROJECT ***"

# Create the project directory
cordova create $PROJECT_DIRECTORY $PROJECT_ID "$PROJECT_NAME"
sed -i '.original' 's/\<platform name="android"\>/\<\platform name="android"\>\<preference name="android-minSdkVersion" value="16"\/\>/g' "${PROJECT_DIRECTORY}"/config.xml

# Step into the created project directory
cd $PROJECT_DIRECTORY


## Copy all sample relevant resources ##
echo "*** PREPARING SAMPLE CONTENT ***"

# copy css
cp -R "${SOURCE_DIRECTORY}"/css/* "${DESTINATION_DIRECTORY}"/css

# copy jquery
cp -R "${SOURCE_DIRECTORY}"/jquery "${DESTINATION_DIRECTORY}"

# copy js
cp -R "${SOURCE_DIRECTORY}"/js/* "${DESTINATION_DIRECTORY}"/js

# add samples
cp -R "${SOURCE_DIRECTORY}"/world "${DESTINATION_DIRECTORY}"/

# copy index.html
cp -R "${SOURCE_DIRECTORY}"/index.html "${DESTINATION_DIRECTORY}"/index.html


## Build sample app
echo "*** BUILDING SAMPLE APP ***"

if [ "true" == "$BUILD_IOS" ]; then
	echo "iOS"
	cordova platform add ios
	cordova build ios

	# Add location access description key/value to info.plist
	/usr/libexec/PlistBuddy -c "Add :NSLocationWhenInUseUsageDescription string 'Accessing GPS information is needed to display POIs around your current location'" "${DESTINATION_DIRECTORY}"/../platforms/ios/"${PROJECT_NAME}"/"${PROJECT_NAME}"-Info.plist

	# copy app icons
	ICON_DESTINATION_PATH="${DESTINATION_DIRECTORY}"/../platforms/ios/"${PROJECT_NAME}"/Resources/icons
	if ! [ -d "${ICON_DESTINATION_PATH}" ]; then
		# cordova version 6
    		ICON_DESTINATION_PATH="${DESTINATION_DIRECTORY}"/../platforms/ios/"${PROJECT_NAME}"/Images.xcassets
    		rm -r "$ICON_DESTINATION_PATH"/AppIcon.appiconset
    		cp -R "${SOURCE_DIRECTORY}"/icons/ios/cordova_6/ "$ICON_DESTINATION_PATH"
    	else
	    	# older cordova versions
		rm -r "$ICON_DESTINATION_PATH"/*
		cp -R "${SOURCE_DIRECTORY}"/icons/ios/cordova_5/* "$ICON_DESTINATION_PATH"
	fi
fi
if [ "true" == "$BUILD_ANDROID" ]; then
	echo "Android"
	cordova platform add android@5.0.0
	cordova build android

	# copy app icons
	ICON_DESTINATION_PATH="${DESTINATION_DIRECTORY}"/../platforms/android/res
	cp -a "${SOURCE_DIRECTORY}"/icons/android/* "$ICON_DESTINATION_PATH"
fi


## Add Wikitude plugin
echo "*** ADDING WIKITUDE PLUGIN ***"

if [ "true" == "$USE_PLUGIN_SOURCE" ]; then
	cordova plugin add $PLUGIN_SOURCE
else
	echo "Fetching plugin from default GitHub master"
	cordova plugin add https://github.com/Wikitude/wikitude-cordova-plugin.git
fi


## Add Cordova File plugin
cordova plugin add cordova-plugin-file


# Install Wikitude SDK license
echo "** ADDING WIKITUDE SDK LICENSE ***"

# Read in the license key
LICENSE_FILE="${SOURCE_DIRECTORY}"/../com.wikitude.phonegapsamples.lic.signed
LICENSE_KEY=`cat "${LICENSE_FILE}"`

if [ "true" == "$BUILD_IOS" ]; then
	# Replace license key for iOS
	INPUT_FILE=$PROJECT_DIRECTORY/platforms/ios/www/plugins/com.wikitude.phonegap.WikitudePlugin/www/WikitudePlugin.js

	sed -i.bak -e "s/ENTER-YOUR-KEY-HERE/${LICENSE_KEY//\//\/}/g" $INPUT_FILE && rm $INPUT_FILE.bak
fi

if [ "true" == "$BUILD_ANDROID" ]; then
	# ... and Android
	INPUT_FILE=$PROJECT_DIRECTORY/platforms/android/assets/www/plugins/com.wikitude.phonegap.WikitudePlugin/www/WikitudePlugin.js

	sed -i.bak -e "s/ENTER-YOUR-KEY-HERE/${LICENSE_KEY//\//\/}/g" $INPUT_FILE && rm $INPUT_FILE.bak
fi


echo "*** DONE - SUCCESS ***"
