var connectedVideoSources;
function successCB(source, type) {
    console.log("setSource() is successfully done. source name = " + source.name + ", source port number = " + source.number);
}

function errorCB(error) {
    console.log("setSource() is failed. Error name = "+ error.name + ", Error message = " + error.message);
}

function systemInfoSuccessCB(videoSource) {
    connectedVideoSources = videoSource.connected;
    for (var i = 0; i < connectedVideoSources.length; i++) {
        console.log("--------------- Source " + i + " ---------------");
        console.log("type = " + connectedVideoSources[i].type);
        console.log("number = " + connectedVideoSources[i].number);
        if (connectedVideoSources[i].type === "HDMI") {
            // set HDMI as input source of the TV window
            tizen.tvwindow.setSource(connectedVideoSources[i], successCB, errorCB);
            break;
        }
    }
}

function systemInfoErrorCB(error) {
    console.log("getPropertyValue(VIDEOSOURCE) is failed. Error name = "+ error.name + ", Error message = " + error.message);
}

try {
    tizen.systeminfo.getPropertyValue("VIDEOSOURCE", systemInfoSuccessCB, systemInfoErrorCB);
} catch (error) {
    console.log("Error name = "+ error.name + ", Error message = " + error.message);
}
