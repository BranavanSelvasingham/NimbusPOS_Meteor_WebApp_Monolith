Maestro.Templates.WaiterLockSettings = "WaiterLockSettings";

Template.WaiterLockSettings.onRendered(function () {
	
});

Template.WaiterLockSettings.helpers({
	waiterPinLockConfig: function(){
	let business = Businesses.findOne({_id: Maestro.Client.businessId()});
		if (business.configuration){
			if (business.configuration.enableWaiterPinLock){
				if (business.configuration.enableWaiterPinLock == true){
					return "checked";
				}
			}
		}	
	}
});

Template.WaiterLockSettings.events({
	'click #enableWaiterPinLock': function(event, target){
		let enableStatus = document.getElementById('enableWaiterPinLock').checked;

		var business = Businesses.findOne({_id: Maestro.Client.businessId()});

		business.configuration.enableWaiterPinLock = enableStatus;

		Meteor.call('setBusinessAttr', Maestro.Client.businessId(), {configuration: business.configuration}, function(error, result) {
            if(error) {
                console.log(error);
            } else {
                Materialize.toast("Updated", 1000);
        	}
        });
	}
});