Maestro.Templates.POSAdminMenuSettings = "POSAdminMenuSettings";

Template.POSAdminMenuSettings.onCreated(function () {
	
});

Template.POSAdminMenuSettings.helpers({
    getAdminMenuPassword: function(){
    	let business = Maestro.Business.getBusiness() || {};
    	if(!!business.configuration ){
    		return business.configuration.adminPin || "abcd1234";
    	}
    },
});

Template.POSAdminMenuSettings.events({
	'click #updateAdminMenuPassword': function(event, target){
		let password = document.getElementById('adminMenuPassword').value;
		if(!password) {return;}

		var business = Businesses.findOne({_id: Maestro.Client.businessId()});

		business.configuration.adminPin = password;

		Meteor.call('setBusinessAttr', Maestro.Client.businessId(), {configuration: business.configuration}, function(error, result) {
            if(error) {
                console.log(error);
            } else {
                Materialize.toast("Updated", 1000);
        	}
        });
	}
});