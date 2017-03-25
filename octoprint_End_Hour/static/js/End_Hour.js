/*
 * View model for OctoPrint-End_hour
 *
 * Author: End Hour
 * License: AGPLv3
 */
$(function() {
    function End_hourViewModel(parameters) {
        var printerState = parameters[0];
        var settingsState = parameters[1];
        var filesState = parameters[2];
        var self = this;

        // assign the injected parameters, e.g.:
        // self.loginStateViewModel = parameters[0];
        // self.settingsViewModel = parameters[1];

        // TODO: Implement your plugin's view model here.
        printerState.costString = ko.pureComputed(function () {
            var estimated_Print_Time = printerState.estimatedPrintTime();
            var a = new Date();
            var b = new Date(a.getTime() + estimated_Print_Time);

            return '' + b.toLocaleString();
        });

        var originalGetAdditionalData = filesState.getAdditionalData;
        filesState.getAdditionalData = function (data) {
            var output = originalGetAdditionalData(data);

            if (data.hasOwnProperty('gcodeAnalysis')) {
                var gcode = data.gcodeAnalysis;
                if (gcode.hasOwnProperty('filament') && gcode.filament.hasOwnProperty('tool0') && gcode.hasOwnProperty('estimatedPrintTime')) {
                    var estimated_Print_Time = gcode.estimatedPrintTime;
                    var a = new Date();
                    var b = new Date(a.getTime() + estimated_Print_Time);

                    output += "<br>End Hour: " + b.toLocaleString();
                }
            }

            return output;
        };

        self.onStartup = function () {
            var element = $("#state").find(".accordion-inner .progress");
            if (element.length) {
                //var text = gettext("Cost");
                element.before("End Hour" + ": <strong data-bind='text: costString'></strong><br>");
            }
        };

    }

    // view model class, parameters for constructor, container to bind to
    OCTOPRINT_VIEWMODELS.push([
        End_hourViewModel,

        // e.g. loginStateViewModel, settingsViewModel, ...
        ["printerStateViewModel", "settingsViewModel", "gcodeFilesViewModel" /* "loginStateViewModel", "settingsViewModel" */],

        // e.g. #settings_plugin_end_hour, #tab_plugin_end_hour, ...
        [ /* ... */ ]
    ]);
});
