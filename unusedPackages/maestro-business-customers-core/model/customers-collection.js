// Customers = new Maestro.BusinessCollection("customers", Maestro.Schemas.Customer);

Meteor.publish("customers", function() {
	console.log('inside publication');
	var userId = this.userId;
	if(userId) {
		var user = Meteor.users.findOne({_id: userId});
		var businessId = Maestro.Business.getBusinessId();
		if(Roles.userIsInRole(user, 'admin')) { // publish all data to admin
			return [
				Customers.find({}),
			]; 
		} else { // publish user's business data 
			
			return [
				Customers.find({"businessId": businessId})
			];
		}
	}
    //no user - no data to be published
    return [];
});

