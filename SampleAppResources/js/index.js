/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {

    // represents the device capability of launching ARchitect Worlds with specific features
    isDeviceSupported: false,
    isArchitectWorldLoaded: false,

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    onDeviceReady: function() {
        app.wikitudePlugin = cordova.require("com.wikitude.phonegap.WikitudePlugin.WikitudePlugin");
    },
    // --- Wikitude Plugin ---
    // Use this method to load a specific ARchitect World from either the local file system or a remote server
    loadARchitectWorld: function(architectWorld) {

        // check if the current device is able to launch ARchitect Worlds
        app.wikitudePlugin.isDeviceSupported(function() {
            app.wikitudePlugin.setOnUrlInvokeCallback(app.onUrlInvoke);

            // set a callback for android that is called once the back button was clicked.
            if ( cordova.platformId == "android" ) {
                app.wikitudePlugin.setBackButtonCallback(app.onBackButton);
            }

            app.wikitudePlugin.loadARchitectWorld(function successFn(loadedURL) {
                    /* Respond to successful world loading if you need to */
                    app.isArchitectWorldLoaded = true;

                    /* in case the loaded Architect World belongs to the 'obtain poi data from application model' example, we can now safely inject poi data. */
                    if ( architectWorld.requiredExtension === "ObtainPoiDataFromApplicationModel" ) {
                        injectGeneratedPoiJsonData();
                    }
                }, function errorFn(error) {
                    app.isArchitectWorldLoaded = false;
                    alert('Loading AR web view failed: ' + error);
                },
                architectWorld.path, architectWorld.requiredFeatures, architectWorld.startupConfiguration
            );
        }, function(errorMessage) {
            alert(errorMessage);
        },
        architectWorld.requiredFeatures
        );
    },
    loadExampleARchitectWorld: function(example) {

        app.isArchitectWorldLoaded = false;
        // inject poi data using phonegap's GeoLocation API and inject data using World.loadPoisFromJsonData
        if ( example.requiredExtension === "ObtainPoiDataFromApplicationModel" ) {
            prepareApplicationDataModel();
        }

        /* cordova.file.applicationDirectory is used to demonstrate the use of the cordova file plugin in combination with the Wikitude plugin */
        /* The length check here is only necessary because for each example the same 'example' object is given here and we only want to change the path once. */
        if ( example.path.length > cordova.file.applicationDirectory ) {
            if ( example.path.substring(0, cordova.file.applicationDirectory) != cordova.file.applicationDirectory ) {
                example.path = cordova.file.applicationDirectory + example.path;
            }
        }

        app.loadARchitectWorld(example);
    },
    loadCustomARchitectWorldFromURL: function(url) {
        var world = {
            "path": url,
            "requiredFeatures": [
                "2d_tracking",
                "geo"
            ],
            "startupConfiguration": {
                "camera_position": "back"
            }
        };
        app.isArchitectWorldLoaded = false;
        app.loadARchitectWorld(world);
    },
    // This function gets called if you call "document.location = architectsdk://" in your ARchitect World
    onUrlInvoke: function (url) {
        if (url.indexOf('captureScreen') > -1) {
            app.wikitudePlugin.captureScreen(
                function(absoluteFilePath) {
                    alert("snapshot stored at:\n" + absoluteFilePath);
                },
                function (errorMessage) {
                    alert(errorMessage);
                },
                true, null
            );
        } else {
            alert(url + "not handled");
        }
    },
    onBackButton: function() {
        /* Android back button was pressed and the Wikitude PhoneGap Plugin is now closed */
    }
    // --- End Wikitude Plugin ---
};

app.initialize();
