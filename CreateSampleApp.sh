#!/bin/sh
#
#  CreateSampleApp.sh
#
#  Created by Wikitude GmbH on 03/26/14.
#
#

# global variables
SAMPLE_APP_DIRECTORY=
BUILD_iOS=false
BUILD_ANDROID=false
BUILD_PROGRAM=cordova

INSTALLER_DIRECTORY=$(pwd)

usage() {
cat <<EOF
Usage: $0 [options] [-]

	Arguments:

	-h, --help
	Display this usage message and exit.

	-d
	Specifies the sample application destination directory (will be created)

	-p
	Specifies which build program will be used. Can be either 'cordova' or 'phonegap'

	-ios
	Specifies if iOS is installed

	-android
	Specifies if Android is installed
EOF
}

while [ "$#" -gt 0 ]; do
	arg=$1
	case $1 in
		# convert "--opt=the value" to --opt "the value".
		# the quotes around the equals sign is to work around a
		# bug in emacs' syntax parsing
		--*'='*) shift; set -- "${arg%=*}" "${arg#*=}" "$@"; continue;;
		-d) shift; SAMPLE_APP_DIRECTORY=$1;;
		-ios) shift; BUILD_iOS=$1;;
		-android) shift; BUILD_ANDROID=$1;;
		-h|--help) usage; exit 0;;
		-p) shift; BUILD_PROGRAM=$1;;
		--) shift; break;;
		-*) echo "unknown option: '$1'";;
		*) break;; # reached the list of file names
	esac
	shift || echo "option '${arg}' requires a value"
done

cd Scripts
sh WikitudePhoneGapSampleGenerator.sh $SAMPLE_APP_DIRECTORY com.wikitude.phonegapsamples "Cordova Examples" "$BUILD_iOS" "$BUILD_ANDROID" "$INSTALLER_DIRECTORY/SampleAppResources" $BUILD_PROGRAM
