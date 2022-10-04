Meteor.publish("expenses", function(businessId) {
	var userId = this.userId;
	if(userId) {
		var user = Meteor.users.findOne({_id: userId});
		// var businessId = Maestro.Business.getBusinessId();
		if(Roles.userIsInRole(user, 'admin')) { // publish all data to admin
			return [
				Expenses.find({"businessId": businessId}),
			]; 
		} else { // publish user's business data 
			
			return [
				Expenses.find({"businessId": businessId})
			];
		}
	}
    //no user - no data to be published
    return [];
});

Meteor.publish("expenses-monthly", function(businessId, timeBucket) {
	var userId = this.userId;
	if(userId) {
		var user = Meteor.users.findOne({_id: userId});
		// var businessId = Maestro.Business.getBusinessId();
		if(Roles.userIsInRole(user, 'admin')) { // publish all data to admin
			return [
				Expenses.find({"businessId": businessId, "timeBucket.year": timeBucket.year, "timeBucket.month": timeBucket.month}),
			]; 
		} else { // publish user's business data 
			
			return [
				Expenses.find({"businessId": businessId, "timeBucket.year": timeBucket.year, "timeBucket.month": timeBucket.month}),
			];
		}
	}
    //no user - no data to be published
    return [];
});