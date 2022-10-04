Maestro.Templates.POSAddOnCreationSettings = "POSAddOnCreationSettings";

Template.POSAddOnCreationSettings.onRendered(function () {
	
});

Template.POSAddOnCreationSettings.helpers({
	allowAddOnCreationConfig: function(){
		let business = Businesses.findOne({_id: Maestro.Client.businessId()});
		if (business.configuration){
			if (business.configuration.allowPOSAddOnCreation){
				if (business.configuration.allowPOSAddOnCreation == true){
					return "checked";
				}
			}
		}	
	},

	allowSubstitutionCreationConfig: function(){
		let business = Businesses.findOne({_id: Maestro.Client.businessId()});
		if (business.configuration){
			if (business.configuration.allowPOSSubsitutionCreation){
				if (business.configuration.allowPOSSubsitutionCreation == true){
					return "checked";
				}
			}
		}	
	}
});

Template.POSAddOnCreationSettings.events({
	'click #enableAddOnCreation': function(event, target){
		let enableStatus = document.getElementById('enableAddOnCreation').checked;

		var business = Businesses.findOne({_id: Maestro.Client.businessId()});

		business.configuration.allowPOSAddOnCreation = enableStatus;

		Meteor.call('setBusinessAttr', Maestro.Client.businessId(), {configuration: business.configuration}, function(error, result) {
            if(error) {
                console.log(error);
            } else {
                Materialize.toast("Updated", 1000);
        	}
        });
	},

	'click #enableSusbtitutionCreation': function(event, target){
		let enableStatus = document.getElementById('enableSusbtitutionCreation').checked;

		var business = Businesses.findOne({_id: Maestro.Client.businessId()});

		business.configuration.allowPOSSubsitutionCreation = enableStatus;

		Meteor.call('setBusinessAttr', Maestro.Client.businessId(), {configuration: business.configuration}, function(error, result) {
            if(error) {
                console.log(error);
            } else {
                Materialize.toast("Updated", 1000);
        	}
        });
	}
});