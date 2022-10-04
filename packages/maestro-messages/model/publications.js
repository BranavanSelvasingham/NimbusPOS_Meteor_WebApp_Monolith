Meteor.publish("conversations", function(businessId) {
	var userId = this.userId;

	if(userId) {
		var user = Meteor.users.findOne({_id: userId});
		// var businessId = Maestro.Business.getBusinessId();
		if(Roles.userIsInRole(user, 'admin')) { // publish all data to admin
			return [
				Conversations.find({"businessId": businessId})
			]; 
		} else { // publish user's business data 
			
			return [
				Conversations.find({"businessId": businessId})
			];
		}
	}
    //no user - no data to be published
    return [];
});

Meteor.publish("support-conversations", function(businessId) {
	var userId = this.userId;

	if(userId) {
		var user = Meteor.users.findOne({_id: userId});
		// var businessId = Maestro.Business.getBusinessId();
		if(Roles.userIsInRole(user, 'admin')) { // publish all data to admin
			return [
				Conversations.find({"businessId": businessId, "supportConversation": true})
			]; 
		} else { // publish user's business data 
			
			return [
				Conversations.find({"businessId": businessId, "supportConversation": true})
			];
		}
	}
    //no user - no data to be published
    return [];
});


Meteor.publish("messagesInConversation", function(conversationId) {
	var userId = this.userId;
	
	if(userId) {
		var user = Meteor.users.findOne({_id: userId});
		// var businessId = Maestro.Business.getBusinessId();
		if(Roles.userIsInRole(user, 'admin')) { // publish all data to admin
			return [
				Messages.find({"conversationId": conversationId})
			]; 
		} else { // publish user's business data 
			
			return [
				Messages.find({"conversationId": conversationId})
			];
		}
	}
    //no user - no data to be published
    return [];
});
