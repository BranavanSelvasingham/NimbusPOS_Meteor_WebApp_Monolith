// Customers = new Maestro.BusinessCollection("customers", Maestro.Schemas.Customer);

Meteor.publish("customers", function(businessId) {
	var userId = this.userId;
	if(userId) {
		var user = Meteor.users.findOne({_id: userId});

		// if(Roles.userIsInRole(user, 'admin')) { // publish all data to admin
		// 	return [
		// 		Customers.find({}),
		// 	]; 
		// } else { // publish user's business data 
			// var businessId = Maestro.Business.getBusinessId();
			return [
				Customers.find({"businessId": businessId})
			];
		// }
	}
    //no user - no data to be published
    return [];
});

