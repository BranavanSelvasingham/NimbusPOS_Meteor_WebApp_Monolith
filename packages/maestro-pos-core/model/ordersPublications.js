Meteor.publish("orders", function(businessId) {
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

Meteor.publish("orders-start-end-date", function(businessId, fromDate, toDate) {
	var userId = this.userId;

	var startDate, endDate;

	// if(!!fromDate){
	// 	startDate = new Date(fromDate);
	// 	startDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
	// } else {
	// 	startDate = new Date();
	// 	startDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()-1);
	// }

	// if(!!toDate){
	// 	endDate = new Date(toDate);
	// 	endDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
	// } else {
	// 	endDate = new Date(startDate);
	// 	endDate.setDate(endDate.getDate()+1);
	// }

	startDate = fromDate;

	if(!!toDate){
		endDate = toDate;
	} else {
		endDate = startDate;
		endDate.setDate(endDate.getDate()+1);
	}

	// console.log('times: ', startDate, endDate);
	// console.log('total orders detected', Orders.find({"businessId": businessId, "createdAt": {$gt:startDate, $lt:endDate}}, {sort: {"createdAt": -1}}).fetch().length);

	if(userId) {
		var user = Meteor.users.findOne({_id: userId});
		// var businessId = Maestro.BUsiness.getBusinessId();
		if(Roles.userIsInRole(user, 'admin')) { // publish all data to admin
			return [
				Orders.find({"businessId": businessId, "createdAt": {$gt:startDate, $lt:endDate}}, {sort: {"createdAt": -1}})
			]; 
		} else { // publish user's business data 
			return [
				Orders.find({"businessId": businessId, "createdAt": {$gt:startDate, $lt:endDate}}, {sort: {"createdAt": -1}})
			];
		}
	}
    //no user - no data to be published
    return [];
});

Meteor.publish("orders-start-end-date-location", function(businessId, locationId, fromDate, toDate) {
	var userId = this.userId;

	var startDate, endDate;

	startDate = fromDate;

	if(!!toDate){
		endDate = toDate;
	} else {
		endDate = startDate;
		endDate.setDate(endDate.getDate()+1);
	}

	// console.log('times: ', startDate, endDate);
	// console.log('total orders detected', Orders.find({"businessId": businessId, "createdAt": {$gt:startDate, $lt:endDate}}, {sort: {"createdAt": -1}}).fetch().length);

	if(userId) {
		var user = Meteor.users.findOne({_id: userId});
		// var businessId = Maestro.BUsiness.getBusinessId();
		if(Roles.userIsInRole(user, 'admin')) { // publish all data to admin
			return [
				Orders.find({"businessId": businessId, "locationId": locationId, "createdAt": {$gt:startDate, $lt:endDate}}, {sort: {"createdAt": -1}})
			]; 
		} else { // publish user's business data 
			return [
				Orders.find({"businessId": businessId, "locationId": locationId, "createdAt": {$gt:startDate, $lt:endDate}}, {sort: {"createdAt": -1}})
			];
		}
	}
    //no user - no data to be published
    return [];
});

Meteor.publish("orders-limit", function(businessId, limit) {
	var userId = this.userId;

	// console.log('inside orders-limit', limit);

	// console.log(Orders.find({"businessId": businessId}, {limit: limit}).fetch());

	if(userId) {
		var user = Meteor.users.findOne({_id: userId});
		// var businessId = Maestro.BUsiness.getBusinessId();
		if(Roles.userIsInRole(user, 'admin')) { // publish all data to admin
			return [
				Orders.find({"businessId": businessId}, {sort: {"createdAt": -1}, limit: limit})
			]; 
		} else { // publish user's business data 
			return [
				Orders.find({"businessId": businessId}, {sort: {"createdAt": -1}, limit: limit})
			];
		}
	}
    //no user - no data to be published
    return [];
});

Meteor.publish("orders-location-specific", function(businessId, locationId, limit){
	var userId = this.userId;

	// console.log('inside orders-location-specific', limit);

	// console.log(Orders.find({"businessId": businessId, "locationId": locationId}, {limit: limit}).fetch());

	if(userId) {
		var user = Meteor.users.findOne({_id: userId});
		// var businessId = Maestro.BUsiness.getBusinessId();
		if(Roles.userIsInRole(user, 'admin')) { // publish all data to admin
			return [
				Orders.find({"businessId": businessId, "locationId": locationId}, {sort: {"createdAt": -1}, limit: limit})
			]; 
		} else { // publish user's business data 
			return [
				Orders.find({"businessId": businessId,  "locationId": locationId}, {sort: {"createdAt": -1}, limit: limit})
			];
		}
	}
    //no user - no data to be published
    return [];
});

Meteor.publish("orders-uniquenumber", function(businessId, orderNumber){
	var userId = this.userId;

	// console.log('orders unique number: ', businessId, orderNumber);

	if(!orderNumber || orderNumber < 100){
		return [];
	}

	// console.log(Orders.find({"businessId": businessId, "uniqueOrderNumber": orderNumber}, {sort: {"createdAt": -1}, limit: 20}).fetch());

	if(userId) {
		var user = Meteor.users.findOne({_id: userId});
		// var businessId = Maestro.BUsiness.getBusinessId();
		if(Roles.userIsInRole(user, 'admin')) { // publish all data to admin
			return [
				Orders.find({"businessId": businessId, "uniqueOrderNumber": orderNumber}, {sort: {"createdAt": -1}, limit: 20})
			]; 
		} else { // publish user's business data 
			return [
				Orders.find({"businessId": businessId,  "uniqueOrderNumber": orderNumber}, {sort: {"createdAt": -1}, limit: 20})
			];
		}
	}
    //no user - no data to be published
    return [];
});

Meteor.publish("orders-genericSearch", function(businessId, locationId = null, genericSearchObj, limit){
	var userId = this.userId;

	if(!businessId){return [];}

	let findFilter = genericSearchObj || {};

	findFilter.businessId = businessId;

	if(!!locationId){findFilter.locationId = locationId;}

	let options = {};
	options.sort = {"createdAt": -1};
	if(!!limit){options.limit = limit;}

	if(userId) {
		return [
			Orders.find(findFilter, options)
		];
	}
    //no user - no data to be published
    return [];
});

Meteor.publish("orders-orderId", function(businessId, orderId){
	var userId = this.userId;

	if(userId) {
		var user = Meteor.users.findOne({_id: userId});
		// var businessId = Maestro.BUsiness.getBusinessId();
		if(Roles.userIsInRole(user, 'admin')) { // publish all data to admin
			return [
				Orders.find({"businessId": businessId, _id: orderId}, {})
			]; 
		} else { // publish user's business data 
			return [
				Orders.find({"businessId": businessId, _id: orderId}, {})
			];
		}
	}
    //no user - no data to be published
    return [];
});

Meteor.publish("orders-incomplete-atLocation-today", function(businessId, locationId, referenceDate) {
	var userId = this.userId;

	if(userId) {
		var user = Meteor.users.findOne({_id: userId});
		// var businessId = Maestro.BUsiness.getBusinessId();
		if(Roles.userIsInRole(user, 'admin')) { // publish all data to admin
			return [
				Orders.find({"businessId": businessId, "locationId": locationId, "status": "Created", "createdAt": {$gt:referenceDate}}, {sort: {"createdAt": -1}})
			]; 
		} else { // publish user's business data 
			return [
				Orders.find({"businessId": businessId, "locationId": locationId, "status": "Created", "createdAt": {$gt:referenceDate}}, {sort: {"createdAt": -1}})
			];
		}
	}
    //no user - no data to be published
    return [];
});

Meteor.publish("orders-incomplete-atLocation", function(businessId, locationId) {
	var userId = this.userId;

	if(userId) {
		var user = Meteor.users.findOne({_id: userId});
		// var businessId = Maestro.BUsiness.getBusinessId();
		if(Roles.userIsInRole(user, 'admin')) { // publish all data to admin
			return [
				Orders.find({"businessId": businessId, "locationId": locationId, "status": "Created"}, {sort: {"createdAt": -1}})
			]; 
		} else { // publish user's business data 
			return [
				Orders.find({"businessId": businessId, "locationId": locationId, "status": "Created"}, {sort: {"createdAt": -1}})
			];
		}
	}
    //no user - no data to be published
    return [];
});