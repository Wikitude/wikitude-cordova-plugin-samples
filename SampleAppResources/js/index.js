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

        // check if the current device is able to launch ARchitect Worlds
        app.wikitudePlugin = cordova.require("com.wikitude.phonegap.WikitudePlugin.WikitudePlugin");
        app.wikitudePlugin.isDeviceSupported(function() {
                app.isDeviceSupported = true;
            }, function(errorMessage) {
                app.isDeviceSupported = false;    
                alert('Unable to launch ARchitect Worlds on this device: \n' + errorMessage);            
            },
            app.wikitudePlugin.FeatureGeo | app.wikitudePlugin.Feature2DTracking
        );
    },
    // --- Wikitude Plugin ---
    // Use this method to load a specific ARchitect World from either the local file system or a remote server
    loadARchitectWorld: function(samplePath) {

        app.wikitudePlugin.setOnUrlInvokeCallback(app.onUrlInvoke);

        if (app.isDeviceSupported) {
            app.wikitudePlugin.loadARchitectWorld(function(url) {
                /* Respond to successful world loading if you need to */ 
                }, function(err) {
                    alert('Loading AR web view failed: ' + err);
                },
                samplePath,
                app.wikitudePlugin.FeatureGeo | app.wikitudePlugin.Feature2DTracking
            );

            // inject poi data using phonegap's GeoLocation API and inject data using World.loadPoisFromJsonData
            if ( "www/world/4_ObtainPoiData_1_FromApplicationModel/index.html" === samplePath ) {
                navigator.geolocation.getCurrentPosition(onLocationUpdated, onLocationError);
            }
        } else {
            alert("Device is not supported");
        }
    },
    // This function gets called if you call "document.location = architectsdk://" in your ARchitect World
    onUrlInvoke: function (url) {
        if (url.indexOf('captureScreen') > -1) {
            app.wikitudePlugin.captureScreen(true, null, function(absoluteFilePath) {
                    alert("snapshot stored at:\n" + absoluteFilePath);
                }, function (errorMessage) {
                    alert(errorMessage);                
                }
            );
        } else {
            alert(url + "not handled");
        }
    }
    // --- End Wikitude Plugin ---
};

app.initialize();
