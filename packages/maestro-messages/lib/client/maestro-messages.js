Maestro.Messages = {};

Maestro.Messages.StartSupportConversation = function(){
    let newConversation = {
    	businessId: Maestro.Business.getBusinessId(),
    	supportConversation: true,
    	customerConversation: false
    };

    Conversations.insert(newConversation);
};

Maestro.Messages.SendSupportMessage = function(conversationId, messageText){
	if(!messageText || !conversationId ){return;}
	let messageTimeStamp = new Date();

	let newMessage = {
		conversationId: conversationId,
		businessId: Maestro.Business.getBusinessId(),
		locationId: Maestro.Business.getLocationId(),
		createdAt: messageTimeStamp,
		supportMessage: true,
		customerMessage: false,
		timeBucket: {
			year: messageTimeStamp.getFullYear(),
		    month: messageTimeStamp.getMonth(),
		    day: messageTimeStamp.getDate(),
		    hour: messageTimeStamp.getHours(),
		    minute: messageTimeStamp.getMinutes(), 
		    seconds: messageTimeStamp.getSeconds(), 
		},
		messageText: messageText
	};

	let messageId = Messages.insert(newMessage);

	Maestro.Messages.SendSupportMessageNotification(newMessage);
};

Maestro.Messages.GetConversation = function(conversationId){
	return Conversations.findOne({_id: conversationId});
};

Maestro.Messages.GetAllConversations = function(){
	return Conversations.find({}).fetch();
};

Maestro.Messages.GetAllSupportConversations = function(){
	return Conversations.find({supportConversation: true}, {sort: {createdAt: 1}}).fetch();
};

Maestro.Messages.GetAllMessagesInConversation = function(conversationId){
	return Messages.find({conversationId: conversationId}, {sort: {createdAt: 1}}).fetch();
};

Maestro.Messages.GetLatestMessageInConversation = function(conversationId){
	return Messages.findOne({conversationId: conversationId}, {sort: {createdAt: -1}});
};

Maestro.Messages.SendSupportMessageNotification = function(message){
	if(!message){return;}

	let business = Businesses.findOne({_id: message.businessId});
	let location = Locations.findOne({_id: message.locationId});
	let toEmail = ["branavan.selva@gmail.com", "info@nimbuspos.com"];
	let businessName = business.name;

	let fromEmail = business.email;
	let subjectLine = "Support Chat from " + businessName;
	let messageBody = "";

	let messageBusinessName =  "<h3>"+businessName+ " @ "+ location.name + "</h3>";
	let messageHeaderHTML = "<h4>New Message:</h4>";	
	let messageText = "<h3>" + message.messageText + "</h3>";
	messageBody = messageBusinessName + "<hr>" + messageHeaderHTML  + messageText + "<br>&nbsp;<br>"; // + productsTableHTML;

	let messageBox = "<div style='width: 400px; \
								color: black; \
								background-color: white; \
								padding-top: 10px; \
								padding-right: 10px; \
								padding-bottom: 10px; \
								padding-left: 20px;'>" + messageBody + "</div>";
	// width: 300px; background-color: white; box-shadow: 5px 5px 3px #888888;
	let htmlBody = messageBox;

	Meteor.call('sendEmail', toEmail, fromEmail, subjectLine, messageBody, htmlBody, function(error, result){
		if(error){
			// Materialize.toast('Email Failed To Send', 2000, 'rounded red');
		} else {
			// Materialize.toast('Emailed Reminder', 2000, 'rounded green');
		}
	});

};