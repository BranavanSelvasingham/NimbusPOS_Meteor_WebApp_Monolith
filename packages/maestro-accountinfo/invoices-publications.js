Meteor.publish("invoices", function(businessId) {
	var userId = this.userId;
	if(userId) {
		var user = Meteor.users.findOne({_id: userId});
		// var businessId = Maestro.Business.getBusinessId();
		if(Roles.userIsInRole(user, 'admin')) { // publish all data to admin
			return [
				Invoices.find({"businessId": businessId}),
			]; 
		} else { // publish user's business data 
			
			return [
				Invoices.find({"businessId": businessId})
			];
		}
	}
    //no user - no data to be published
    return [];
});