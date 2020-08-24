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

BUILD_PROGRAM=$7

USE_PLUGIN_SOURCE=false

if [ "$#" -eq 8 ]; then
	USE_PLUGIN_SOURCE=true
	PLUGIN_SOURCE=$8
fi


## Run some checks if we can proceed...
if [ -d $PROJECT_DIRECTORY ]; then
	echo "Project directory already exists"
	exit 1
fi

echo "program: ${BUILD_PROGRAM}" 

## Generate sample project ##
echo "*** GENERATING PROJECT ***"

# Create the project directory
$BUILD_PROGRAM create $PROJECT_DIRECTORY $PROJECT_ID "$PROJECT_NAME"
sed -i'.original' 's/\<platform name="android"\>/\<\platform name="android"\>\<preference name="android-minSdkVersion" value="22"\/\>/g' "${PROJECT_DIRECTORY}"/config.xml
sed -i'.original' 's/\<platform name="ios"\>/\<\platform name="ios"\>\<preference name="deployment-target" value="12.0"\/\>/g' "${PROJECT_DIRECTORY}"/config.xml

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
	echo "iOS (${BUILD_PROGRAM} version '"$(${BUILD_PROGRAM} --version)"')"
	$BUILD_PROGRAM platform add ios

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
	echo "Android (${BUILD_PROGRAM} version '"$(${BUILD_PROGRAM} --version)"')"
	$BUILD_PROGRAM platform add android

	# copy app icons
	ICON_DESTINATION_PATH="${DESTINATION_DIRECTORY}"/../platforms/android/app/src/main/res
	if [ -d "${ICON_DESTINATION_PATH}" ]; then
    cp -a "${SOURCE_DIRECTORY}"/icons/android/* "$ICON_DESTINATION_PATH"
  else
    ICON_DESTINATION_PATH="${DESTINATION_DIRECTORY}"/../platforms/android/res
    cp -a "${SOURCE_DIRECTORY}"/icons/android/* "$ICON_DESTINATION_PATH"
  fi
fi


## Add Wikitude plugin
echo "*** ADDING WIKITUDE PLUGIN ***"

if [ "true" == "$USE_PLUGIN_SOURCE" ]; then
	$BUILD_PROGRAM plugin add $PLUGIN_SOURCE
else
	echo "Fetching plugin from default GitHub master"
	$BUILD_PROGRAM plugin add https://github.com/Wikitude/wikitude-cordova-plugin.git
fi

## Add Insomnia PhoneGap Plugin
echo "*** ADDING INSOMNIA PHONEGAP PLUGIN ***"
$BUILD_PROGRAM plugin add https://github.com/EddyVerbruggen/Insomnia-PhoneGap-Plugin.git

## Add Cordova File plugin
$BUILD_PROGRAM plugin add cordova-plugin-file


# Install Wikitude SDK license
echo "** ADDING WIKITUDE SDK LICENSE ***"

# Read in the license key
LICENSE_FILE="${SOURCE_DIRECTORY}"/../com.wikitude.phonegapsamples.lic.signed
LICENSE_KEY=`cat "${LICENSE_FILE}"`

if [ "true" == "$BUILD_IOS" ]; then
	# Replace license key for iOS

	INPUT_FILES[0]=$PROJECT_DIRECTORY/platforms/ios/platform_www/plugins/com.wikitude.phonegap.wikitudeplugin/www/WikitudePlugin.js
	INPUT_FILES[1]=$PROJECT_DIRECTORY/platforms/ios/www/plugins/com.wikitude.phonegap.wikitudeplugin/www/WikitudePlugin.js
	INPUT_FILES[2]=$PROJECT_DIRECTORY/plugins/com.wikitude.phonegap.wikitudeplugin/www/WikitudePlugin.js

    for INPUT_FILE in "${INPUT_FILES[@]}"
    do
        sed -i.bak -e "s/ENTER-YOUR-KEY-HERE/${LICENSE_KEY//\//\/}/g" $INPUT_FILE && rm $INPUT_FILE.bak
    done

    # Add location access description key/value to info.plist
	/usr/libexec/PlistBuddy -c "Add :NSLocationWhenInUseUsageDescription string 'Access to your current location information (GPS) is needed to find the nearest points of interest around your current position.'" "${DESTINATION_DIRECTORY}"/../platforms/ios/"${PROJECT_NAME}"/"${PROJECT_NAME}"-Info.plist

	# Add camera access description key/value to info.plist
	/usr/libexec/PlistBuddy -c "Add :NSCameraUsageDescription string 'Access to the camera is needed to display augmented reality content on top of your camera image.'" "${DESTINATION_DIRECTORY}"/../platforms/ios/"${PROJECT_NAME}"/"${PROJECT_NAME}"-Info.plist

	# Add photo library access description key/value to info.plist
	/usr/libexec/PlistBuddy -c "Add :NSPhotoLibraryUsageDescription string 'Access to your photo library is required for the example 'Bonus: Capture Screen' because it adds a screenshot of the current Architect view.'" "${DESTINATION_DIRECTORY}"/../platforms/ios/"${PROJECT_NAME}"/"${PROJECT_NAME}"-Info.plist
	/usr/libexec/PlistBuddy -c "Add :NSPhotoLibraryAddUsageDescription string 'Access to your photo library is required for the example 'Bonus: Capture Screen' because it adds a screenshot of the current Architect view.'" "${DESTINATION_DIRECTORY}"/../platforms/ios/"${PROJECT_NAME}"/"${PROJECT_NAME}"-Info.plist
fi

if [ "true" == "$BUILD_ANDROID" ]; then
	# ... and Android

	INPUT_FILES[0]=$PROJECT_DIRECTORY/platforms/android/platform_www/plugins/com.wikitude.phonegap.wikitudeplugin/www/WikitudePlugin.js
	INPUT_FILES[1]=$PROJECT_DIRECTORY/platforms/android/assets/www/plugins/com.wikitude.phonegap.wikitudeplugin/www/WikitudePlugin.js
	INPUT_FILES[2]=$PROJECT_DIRECTORY/plugins/com.wikitude.phonegap.wikitudeplugin/www/WikitudePlugin.js

    for INPUT_FILE in "${INPUT_FILES[@]}"
    do
        sed -i.bak -e "s/ENTER-YOUR-KEY-HERE/${LICENSE_KEY//\//\/}/g" $INPUT_FILE && rm $INPUT_FILE.bak
    done
fi

echo "*** DONE - SUCCESS ***"
