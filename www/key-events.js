/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */

/**
 * This class contains information about the current battery status.
 * @constructor
 */
var cordova = require('cordova');
var exec = require('cordova/exec');

var KeyEventHandler = function () {
    // this._level = null;
    // this._isPlugged = null;
    // // Create new event handlers on the window (returns a channel instance)
    // this.channels = {
    //     batterystatus: cordova.addWindowEventHandler('batterystatus'),
    //     batterylow: cordova.addWindowEventHandler('batterylow'),
    //     batterycritical: cordova.addWindowEventHandler('batterycritical')
    // };
    this.channel = cordova.addWindowEventHandler('keyevent')
    this.channel.onHasSubscribersChange = KeyEventHandler.onHasSubscribersChange;
};

function handlers () {
    return (
        keyEventHandler.channel.numHandlers
    );
}

/**
 * Event handlers for when callbacks get registered for the battery.
 * Keep track of how many handlers we have so we can start and stop the native battery listener
 * appropriately (and hopefully save on battery life!).
 */
KeyEventHandler.onHasSubscribersChange = function () {
    // If we just registered the first handler, make sure native listener is started.
    if (this.numHandlers === 1 && handlers() === 1) {
        exec(keyEventHandler._callback, keyEventHandler._error, 'KeyEvents', 'start', []);
    } else if (handlers() === 0) {
        exec(null, null, 'KeyEvents', 'stop', []);
    }
};

/**
 * Callback for battery status
 *
 * @param {Object} info            keys: level, isPlugged
 */
KeyEventHandler.prototype._callback = function (event) {
    if (event) {
        console.log('KEYEVENTHANDLER', event)
    }
};

/**
 * Error callback for battery start
 */
KeyEventHandler.prototype._error = function (e) {
    console.log('Error initializing iOS keyboard events: ' + e);
};

var keyEventHandler = new KeyEventHandler();

module.exports = keyEventHandler;