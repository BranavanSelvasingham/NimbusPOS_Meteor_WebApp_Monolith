Maestro.Templates.EmployeeTimeAdjustSettings = "EmployeeTimeAdjustSettings";

Template.EmployeeTimeAdjustSettings.onRendered(function () {
	
});

Template.EmployeeTimeAdjustSettings.helpers({
	disableTimeAdjValue:function(){
		if( Maestro.Business.getConfigurations().disableEmployeeTimeAdjust === true){
			return "checked";
		}
	}
});

Template.EmployeeTimeAdjustSettings.events({
	'click #disableTimeAdjust': function(event, target){
		let enableStatus = document.getElementById('disableTimeAdjust').checked;

		var businessConfig = Maestro.Business.getConfigurations();

		businessConfig.disableEmployeeTimeAdjust = enableStatus;

		Meteor.call('setBusinessAttr', Maestro.Business.getBusinessId(), {configuration: businessConfig}, function(error, result) {
            if(error) {
                console.log(error);
            } else {
                Materialize.toast("Updated", 1000);
        	}
        });
	}
});