Maestro.Templates.PrimaryContactEmail = "PrimaryContactEmail";

Template.PrimaryContactEmail.onCreated(function () {
	
});

Template.PrimaryContactEmail.helpers({
    getBusinessEmail: function(){
    	let business = Maestro.Business.getBusiness();
    	if(!!business){
    		return business.email;
    	}
    },
});

Template.PrimaryContactEmail.events({
	'click #updateEmailInfo': function(event, target){
		let email = document.getElementById('primaryContactEmail').value;
		if(!email) {return;}

		let businessId = Maestro.Business.getBusinessId();

		Meteor.call('setBusinessAttr', businessId, {email: email}, function(error, result){
			if(error){
				Materialize.toast('Failed updating email', 1000);
			} else {
				Materialize.toast('Updated email info', 1000);
			}
		});
	}
});