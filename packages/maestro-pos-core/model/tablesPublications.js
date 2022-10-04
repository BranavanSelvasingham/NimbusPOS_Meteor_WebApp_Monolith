Meteor.publish("tables", function(businessId) {
	// var userId = this.userId;

	// var startDate = new Date();

	// startDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()-1);

	// var endDate = new Date(startDate);
	// endDate.setDate(endDate.getDate()+2);

	// if(userId) {
	// 	var user = Meteor.users.findOne({_id: userId});
	// 	// var businessId = Maestro.BUsiness.getBusinessId();
	// 	if(Roles.userIsInRole(user, 'admin')) { // publish all data to admin
	// 		return [
	// 			Orders.find({"businessId": businessId, "createdAt": {$gt:startDate, $lt:endDate}})
	// 		]; 
	// 	} else { // publish user's business data 
	// 		return [
	// 			Orders.find({"businessId": businessId, "createdAt": {$gt:startDate, $lt:endDate}})
	// 		];
	// 	}
	// }
 //    // no user - no data to be published
    return [];
});


Meteor.publish("tables-location-specific", function(businessId, locationId){
	var userId = this.userId;
	if(userId) {
		var user = Meteor.users.findOne({_id: userId});
		// var businessId = Maestro.BUsiness.getBusinessId();
		if(Roles.userIsInRole(user, 'admin')) { // publish all data to admin
			return [
				Tables.find({"businessId": businessId, "locationId": locationId})
			]; 
		} else { // publish user's business data 
			return [
				Tables.find({"businessId": businessId,  "locationId": locationId})
			];
		}
	}
    //no user - no data to be published
    return [];
});
