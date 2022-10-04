Meteor.publish("employees", function(businessId) {
	var userId = this.userId;
	if(userId) {
		var user = Meteor.users.findOne({_id: userId});
		// var businessId = Maestro.Business.getBusinessId();
		if(Roles.userIsInRole(user, 'admin')) { // publish all data to admin
			return [
				Employees.find({"businessId": businessId}),
			]; 
		} else { // publish user's business data 
			
			return [
				Employees.find({"businessId": businessId})
			];
		}
	}
    //no user - no data to be published
    return [];
});