var exec = require('cordova/exec');

function EscPos() {
    console.log("EscPos initialized");
}

EscPos.prototype.printSample = function (data, printerInfo, successCallback, errorCallback) {
    exec(
        function (successParam) {
            successCallback(successParam);
        },
        function (error) {
            errorCallback(error);
        },
        "EscPos", "printSample", [data, printerInfo]
    );
};

EscPos.prototype.printerCommand = function (printDataObject, printerInfo, successCallback, errorCallback) {
    exec(
        function (successParam) {
            successCallback(successParam);
        },
        function (error) {
            errorCallback(error);
        },
        "EscPos", "printerCommand", [printDataObject, printerInfo]
    );
};

EscPos.prototype.printLines = function (printDataObject, printerInfo, successCallback, errorCallback) {
    exec(
        function (successParam) {
            successCallback(successParam);
        },
        function (error) {
            errorCallback(error);
        },
        "EscPos", "printLines", [printDataObject, printerInfo]
    );
};

EscPos.prototype.printText = function (textData, printerInfo, successCallback, errorCallback) {
    exec(
        function (successParam) {
            successCallback(successParam);
        },
        function (error) {
            errorCallback(error);
        },
        "EscPos", "printText", [textData, printerInfo]
    );
};

EscPos.prototype.sendEscPosCommands = function (commandsData, printerInfo, successCallback, errorCallback) {
    exec(
        function (successParam) {
            successCallback(successParam);
        },
        function (error) {
            errorCallback(error);
        },
        "EscPos", "sendEscPosCommands", [commandsData, printerInfo]
    );
};

EscPos.prototype.searchPrinters = function (successCallback, errorCallback) {
    exec(
        function (printersList) {
            successCallback(printersList);
        },
        function (error) {
            errorCallback(error);
        },
        "EscPos", "searchPrinters", []
    );
};

var escPos = new EscPos();
module.exports = escPos;