Meteor.publish("businessInfo", function() {
	/*var userId = this.userId;
	if(userId) {
		var user = Meteor.users.findOne({_id: userId});
		if(Roles.userIsInRole(user, 'admin')) { // publish all data to admin
			return [
				Businesses.find({}),
				Locations.find({}),
				//Customers.find({}),
				// Employees.find({}),
				LoyaltyPrograms.find({}),
				// Orders.find({}),
				// Products.find({}),
				// ProductCategories.find({}),
				// ProductAddons.find({}),
				// Expenses.find({}),
				// Reminders.find({}),
				Meteor.users.find(),
				BusinessUsers.find()
			]; 
		} else { // publish user's business data 
			var businessId = user.profile.businessId;
			return [
				Businesses.find({"_id": businessId}),
				Locations.find({"businessId": businessId}),
				Customers.find({"businessId": businessId}),
				// Employees.find({"businessId": businessId}),
				LoyaltyPrograms.find({"businessId": businessId}),
				// Orders.find({"businessId": businessId}),
				// Products.find({"businessId": businessId}),
				// ProductCategories.find({"businessId": businessId}),
				// ProductAddons.find({"businessId": businessId}),
				// Expenses.find({"businessId": businessId}),
				// Reminders.find({"businessId": businessId}),
				Meteor.users.find({"profile.businessId": businessId}),
				BusinessUsers.find({"businessId": businessId})
			];
		}
	}*/
    //no user - no data to be published
    return [];
});