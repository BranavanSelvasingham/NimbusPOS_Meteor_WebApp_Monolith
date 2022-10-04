Maestro.Templates.EmailReminderSettings = "EmailReminderSettings";

Template.EmailReminderSettings.onRendered(function () {
	
});

Template.EmailReminderSettings.helpers({
	emailConfigValue:function(){
		let business = Businesses.findOne({_id: Maestro.Client.businessId()});
		if (business.configuration){
			if (business.configuration.emailHoursReminder){
				if (business.configuration.emailHoursReminder == true){
					return "checked";
				}
			}
		}
	}
});

Template.EmailReminderSettings.events({
	'click #enableEmailConfig': function(event, target){
		let enableStatus = document.getElementById('enableEmailConfig').checked;

		var business = Businesses.findOne({_id: Maestro.Client.businessId()});

		business.configuration.emailHoursReminder = enableStatus;

		Meteor.call('setBusinessAttr', Maestro.Client.businessId(), {configuration: business.configuration}, function(error, result) {
            if(error) {
                console.log(error);
            } else {
                Materialize.toast("Updated", 1000);
        	}
        });
	}
});