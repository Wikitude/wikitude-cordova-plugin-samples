@ECHO OFF

::   CreateSampleApp.cmd
::   Created by Wikitude GmbH on 09/02/14.

::   global variables
SET SAMPLE_APP_DIRECTORY=
SET BUILD_iOS=false
SET BUILD_ANDROID=false
SET BUILD_PROGRAM=cordova

SET INSTALLER_DIRECTORY=%CD%
goto argloop

:usage
ECHO Usage: %0 [options]
ECHO.
ECHO	Arguments:
ECHO.
ECHO	-h, --help
ECHO	Display this usage message and exit.
ECHO.
ECHO	-d
ECHO	Specifies the sample application destination directory (will be created)
ECHO.
ECHO	-p
ECHO	Specifies which build program will be used. Can be either 'cordova' or 'phonegap'
ECHO.
ECHO	-ios
ECHO	Specifies if iOS is installed (will not work on windows)
ECHO.
ECHO	-android
ECHO	Specifies if Android is installed
goto scriptend

:argloop
if -%1-==-- goto argend
if -%2-==-- goto usage
if /i %1==-d SET SAMPLE_APP_DIRECTORY=%2
if /i %1==-ios SET SET BUILD_iOS=%2
if /i %1==-android SET BUILD_ANDROID=%2
if /i %1==-p SET BUILD_PROGRAM=%2
if /i %1==-help goto usage
shift
shift
goto argloop
:argend

cd Scripts
sh WikitudePhoneGapSampleGenerator.sh %SAMPLE_APP_DIRECTORY% com.wikitude.phonegapsamples "Plugin Samples" %BUILD_iOS% %BUILD_ANDROID% %INSTALLER_DIRECTORY%/SampleAppResources %BUILD_PROGRAM% 
cd ..

:scriptend
