Meteor.startup(function() {
    Maestro.Client.startupHooks.forEach((customFunction) => { customFunction.apply(this, arguments);});
    
    if(Maestro.Client.isCordova) {
        document.addEventListener("backbutton", function () {
            if(document.location.pathname == "/") {
                navigator.app.exitApp();
            } else {
                history.go(-1);
            }
        });

        StatusBar.backgroundColorByHexString("#4fc3f7");
        StatusBar.styleLightContent();
        
        if(device.platform.toLowerCase() == "android") {
            //enable sticky mode for app
            // Immersify.enableSticky(
            //     function() {
            //         console.log("Maestro is now in running in Fullscreen Immersive Mode");
            //     },
            //     function() {
            //         console.log("Maestro CANNOT run in Fullscreen Immersive Mode");
            //     });

            //Status Bar color setting
            // StatusBar.backgroundColorByHexString("#4fc3f7");
        }

        screen.lockOrientation('landscape');
    }
    
});
