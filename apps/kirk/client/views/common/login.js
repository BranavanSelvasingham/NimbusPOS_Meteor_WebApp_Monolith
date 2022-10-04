Maestro.Templates.Login = "Login";
/*
let checkForFreshAppInstall = function(currentDeviceInfo){
    let businessId = Maestro.Business.getBusinessId();
    let localAppId = UserSession.get(Maestro.UserSessionConstants.LOCAL_APP_ID);
    let business = Businesses.findOne({_id: businessId});

    alert("Device Info: ", currentDeviceInfo.uuid);
    let currentAppObj = {appId: localAppId, deviceId: currentDeviceInfo.uuid, deviceInfo: currentDeviceInfo};

    console.log(business);

    if (business && localAppId){
        if(business.devices){
            let allAppIds = _.pluck(business.devices, 'appId');
            let containsIndex = _.indexOf(allAppIds, localAppId);
            if (containsIndex > -1){
                if(business.devices[containsIndex].posEnabled == true){
                    Maestro.Client.goToUserHome();
                    console.log('allowing entry to home screen');
                }
                return;
            } else {
                business.devices.push(currentAppObj);
            }
        } else {
            business.devices = [currentAppObj];
        }

        let businessAttrMod = {devices: business.devices};

        Meteor.call('setBusinessAttr', businessId, businessAttrMod, function(error, result){
            if(error){
                console.log(error);
            } else {
                console.log('added device to business. waiting for approval');
            }
        });
    }
};*/

let checkForFreshAppInstall = function(currentDeviceInfo){
    let businessId = Maestro.Business.getBusinessId();
    let localAppId = UserSession.get(Maestro.UserSessionConstants.LOCAL_APP_ID);
    let business = Businesses.findOne({_id: businessId});

    let currentAppObj = {appId: localAppId, deviceInfo: currentDeviceInfo};

    if (business && localAppId){
        let existingDevice = _.find(business.devices || [], function(registeredDevice) {
            return registeredDevice.appId == currentAppObj.appId;
        });

        if(existingDevice) {
            if(existingDevice.posEnabled) {
                //device registered and authorised
                Maestro.Client.goToUserHome();
                Materialize.toast("Device registered and authorized. Allowing entry to home screen.", 1000, 'rounded green');
                console.log("Device registered and authorized. Allowing entry to home screen");
            } else {
                //device registered but not yet authorised
                Materialize.toast("Device registered but is not yet an authorized device of this business. Please contact business owner.");
                console.log("Device registered but not yet authorized");
            }
        } else {
            Meteor.call('addNewDevice', businessId, currentAppObj, function(error, result){
                if(error){
                    console.log(error);
                } else {
                    if((Maestro.Business.getConfigurations() || {}).autoEnrollNewDevices != true){
                        Materialize.toast('Added this device to business. Waiting for business owner approval of device.');
                        // console.log('Added device to business. waiting for approval');
                    }
                }
            });
            // let registeredDeviceList = business.devices || [];
            // registeredDeviceList.push(currentAppObj);
            // let businessAttrMod = {devices: registeredDeviceList};

            // Meteor.call('setBusinessAttr', businessId, businessAttrMod, function(error, result){
            //     if(error){
            //         console.log(error);
            //     } else {
            //         if((Maestro.Business.getConfigurations() || {}).autoEnrollNewDevices != true){
            //             Materialize.toast('Added this device to business. Waiting for business owner approval of device.');
            //             // console.log('Added device to business. waiting for approval');
            //         }
            //     }
            // });
        }
    }
};

Template.Login.onCreated(function(){
    this.loginMessage = new ReactiveVar;
    this.loginMessage.set("");
});

Template.Login.helpers({
    message: function() {
        return Template.instance().loginMessage.get() || false;
    }
});

Template.Login.events({
    'click #submit-sign-in': function(event, template) {
        event.preventDefault();

        var userName = template.find("#user-name").value.trim(),
            password = template.find("#password").value;

        Meteor.loginWithPassword(userName, password, function(error) {
            if(error) {
                if(error.reason == "Login forbidden"){
                    Materialize.toast("Login disabled. Please contact us.", 4000, "rounded red")
                } else {
                    Materialize.toast("Login failed. Incorrect username or password.", 4000, "rounded red");
                    template.loginMessage.set(error.reason);
                }
            } else {
                if(!Maestro.Client.isCordova){
                    let loggedInUser = Meteor.user();
                    if (Roles.userIsInRole(loggedInUser, Maestro.roles.BUSINESS_ADMIN)) {
                        if(!!loggedInUser.profile.businessId){
                            let businessId = loggedInUser.profile.businessId;
                            UserSession.set(Maestro.UserSessionConstants.BUSINESS_ID, businessId);
                        }
                    } else {
                        Materialize.toast("You don't have sufficient access to this login portal", 4000, "rounded red");
                        FlowRouter.go(Maestro.route.Logout);
                    }
                } else {
                    //todo use reactive updates from collections instead of timeout
                    let currentDeviceInfo = device;
                    window.setTimeout(function(){
                        checkForFreshAppInstall(currentDeviceInfo);
                    }, 1000);
                }
            }
            
        });

    },

    'click .goBackToPrevious': function(event, template){
        window.history.back();
    },
});