Meteor.publish("reminders", function(businessId) {
	var userId = this.userId;
	if(userId) {
		var user = Meteor.users.findOne({_id: userId});
		// var businessId = Maestro.Business.getBusinessId();
		if(Roles.userIsInRole(user, 'admin')) { // publish all data to admin
			return [
				Reminders.find({"businessId": businessId}),
			]; 
		} else { // publish user's business data 
			
			return [
				Reminders.find({"businessId": businessId})
			];
		}
	}
    //no user - no data to be published
    return [];
});