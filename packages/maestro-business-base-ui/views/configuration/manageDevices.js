Maestro.Templates.ManageDevices = "ManageDevices";

Template.ManageDevices.onCreated(function () {
	this.deviceStatus = new ReactiveDict();
	this.deviceUserStatus = new ReactiveDict();
	this.deviceUserName = new ReactiveDict();
});

Template.ManageDevices.onRendered(function(){
	$('.dropdown-button').dropdown({
		inDuration: 300,
		outDuration: 225,
		// constrain_width: false, // Does not change width of dropdown to that of the activator
		// hover: false, // Activate on hover
		// gutter: 0, // Spacing from edge
		// belowOrigin: false, // Displays dropdown below the button
		alignment: 'left' // Displays dropdown with edge aligned to the left of button
    });
});

Template.ManageDevices.helpers({
    business: function() {
    	return Businesses.findOne({_id: Maestro.Business.getBusinessId()});
    },

	devices: function() {
		let business = Businesses.findOne({_id: Maestro.Business.getBusinessId()});
		let devices = business.devices;
		let template = Template.instance();

		devices = _.map(devices, function(device) {
			template.deviceStatus.set(device.appId, "Offline");
			template.deviceUserStatus.set(device.appId, "Offline");
			template.deviceUserName.set(device.appId, "Not available!");

			UserSession.search(Maestro.UserSessionConstants.LOCAL_APP_ID, device.appId, function(error, result) {
				if(result && result.length > 0) {

					userConnection = result[0];
					template.deviceStatus.set(device.appId, "Online");

					if(userConnection.userId) {
						deviceUser = Meteor.users.findOne({ _id: userConnection.userId });
						if(!!deviceUser && deviceUser.profile.online === "true") {
							template.deviceUserStatus.set(device.appId, "Online");
							template.deviceUserName.set(device.appId, deviceUser.username);
						}
					}
				}
			});

			return device;
		});

		return devices;
	},
	
	deviceStatus: function(appId) {
		return Template.instance().deviceStatus.get(appId);
	},

	deviceOffline: function(appId) {
		return Template.instance().deviceStatus.get(appId) == "Offline";
	},

	userStatus: function(appId) {
		return Template.instance().deviceUserStatus.get(appId);
	},
	
	userName: function(appId) {
		return Template.instance().deviceUserName.get(appId);
	},
	
	userOffline: function(appId) {
		return Template.instance().deviceUserStatus.get(appId) == "Offline";
	},
    isPosEnabled: function(enableFlag){
    	return enableFlag == true;
    },

    getAllLocations: function(appId){
    	return Locations.find({}).fetch();
    },

    getDeviceLocationSetting: function(appId){
    	let business = Maestro.Business.getBusiness();
    	
    	let thisDevice = _.find(business.devices, function(device){
    		return device.appId == appId;
    	});

    	let locationInfo = Locations.findOne({_id: thisDevice.selectedLocation});

    	if (!!locationInfo){
    		return locationInfo.name + " location";
    	} else {
    		return "Location Not Selected";
    	}
    },

    autoEnrollConfig: function(){
    	let business = Businesses.findOne({_id: Maestro.Client.businessId()});
        if (business.configuration){
            if (business.configuration.autoEnrollNewDevices){
                if (business.configuration.autoEnrollNewDevices == true){
                    return "checked";
                }
            }
        }   
    }
});

Template.ManageDevices.events({
	'click #enableAutoEnroll': function(event, target){
        let enableStatus = document.getElementById('enableAutoEnroll').checked;

        var business = Businesses.findOne({_id: Maestro.Client.businessId()});

        business.configuration.autoEnrollNewDevices = enableStatus;

        Meteor.call('setBusinessAttr', Maestro.Client.businessId(), {configuration: business.configuration}, function(error, result) {
            if(error) {
                console.log(error);
            } else {
                Materialize.toast("Updated", 1000);
            }
        });
    },

	'click .saveLocationSetting': function(event, target){
		let businessId = Maestro.Business.getBusinessId();
	    let localAppId = $(event.target).data("appid");
	    let locationId = $(event.target).data("locationid");

	    let business = Businesses.findOne({_id: businessId});

	    if (business && localAppId){
            let allAppIds = _.pluck(business.devices, 'appId');
            let containsIndex = _.indexOf(allAppIds, localAppId);
            if (containsIndex > -1){
                business.devices[containsIndex].selectedLocation = locationId;
            }
	        
	        let businessAttrMod = {devices: business.devices};

	        Meteor.call('setBusinessAttr', businessId, businessAttrMod, function(error, result){
	            if(error){
	                console.log(error);
	            } else {
	                console.log('updated device location');
	            }
	        });
	    }
	},

	'click .togglePosEnable': function(){
		let businessId = Maestro.Business.getBusinessId();
	    let localAppId = this.appId;
	    let business = Businesses.findOne({_id: businessId});

	    if (business && localAppId){
            let allAppIds = _.pluck(business.devices, 'appId');
            let containsIndex = _.indexOf(allAppIds, localAppId);
            if (containsIndex > -1){
                if(business.devices[containsIndex].posEnabled == true){
                    business.devices[containsIndex].posEnabled = false;
                } else {
                	business.devices[containsIndex].posEnabled = true;
                }
            }
	        
	        let businessAttrMod = {devices: business.devices};
	        console.log(business.devices);

	        Meteor.call('setBusinessAttr', businessId, businessAttrMod, function(error, result){
	            if(error){
	                console.log(error);
	            } else {
	                console.log('updated device approval');
	            }
	        });
	    }
	},

	'click #removeDevice': function(event, template) {
		let device = this;
		let appId = device.appId;

		let business = Maestro.Business.getBusiness();

		let updatedDevicesList = _.reject(business.devices || [], function(registeredDevice) {
				return registeredDevice.appId == appId;
			});

		let businessAttrMod = {devices: updatedDevicesList};
		Meteor.call('setBusinessAttr', business._id, businessAttrMod, function(error, result){
			if(error){
				console.log(error);
			} else {
				console.log('removed device');
			}
		});
	}
});