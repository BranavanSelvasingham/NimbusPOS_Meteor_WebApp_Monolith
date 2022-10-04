// LoyaltyPrograms = new Maestro.BusinessCollection("loyalty-programs", Maestro.Schemas.LoyaltyProgram);

Meteor.publish("loyalty-programs", function(businessId) {
	var userId = this.userId;
	if(userId) {
		var user = Meteor.users.findOne({_id: userId});

		// var businessId = Maestro.Business.getBusinessId();
		return [
			LoyaltyPrograms.find({"businessId": businessId}),
		];
		
	}
    //no user - no data to be published
    return [];
});
