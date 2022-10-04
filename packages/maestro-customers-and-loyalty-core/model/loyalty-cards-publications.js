Meteor.publish("loyalty-cards", function(businessId) {
	var userId = this.userId;
	if(userId) {
		var user = Meteor.users.findOne({_id: userId});

		// var businessId = Maestro.Business.getBusinessId();
		return [
			LoyaltyCards.find({"businessId": businessId}),
		];
		
	}
    //no user - no data to be published
    return [];
});