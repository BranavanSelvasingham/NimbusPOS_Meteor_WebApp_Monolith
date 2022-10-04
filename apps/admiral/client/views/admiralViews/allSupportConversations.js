Maestro.Templates.AllSupportConversations = "AllSupportConversations";

Maestro.Admiral.Messages = {};

Maestro.Admiral.Messages.StartSupportConversation = function(businessId){
    let newConversation = {
    	businessId: businessId,
    	supportConversation: true,
    	customerConversation: false
    };

    Conversations.insert(newConversation);
};

Maestro.Admiral.Messages.SendSupportMessage = function(conversationId, messageText){
	let messageTimeStamp = new Date();
	if(!messageText || !conversationId ){return;}
	let newMessage = {
		conversationId: conversationId,
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
};

Maestro.Admiral.Messages.DeleteThisMessage = function(messageId){
	Messages.remove({_id: messageId});
};

Template.AllSupportConversations.onCreated(function(){
	let template = this;

	template.selectedConversation = new ReactiveVar();

	Template.instance().subscribe('admiral-conversations');
	Template.instance().subscribe('admiral-business-cores');

	template.autorun(function(){
		let conversation = Template.instance().selectedConversation.get() || {};
		let latestMessage = Maestro.Messages.GetLatestMessageInConversation(conversation._id);
		if(!!latestMessage){
			Tracker.afterFlush(function(){
		        if(!!document.getElementById('messagesBox')){
		            document.getElementById('messagesBox').scrollTop = document.getElementById('messagesBox').scrollHeight;
		        }
	    	});
	    }
    });

});

Template.AllSupportConversations.onRendered(function(){

});

Template.AllSupportConversations.helpers({
	isSystemIsOnline: function(){
		return Meteor.status().connected;
	},

	getSelectedConversation: function(){
		return Template.instance().selectedConversation.get();
	},

	getAllConversations: function(){
		// console.log(Maestro.Messages.GetAllSupportConversations());
		return Maestro.Messages.GetAllSupportConversations();
	},

	getAllMessagesInConversation: function(){
		let conversation = Template.instance().selectedConversation.get() || {};
		return Maestro.Messages.GetAllMessagesInConversation(conversation._id);
	},

	isNimbusMessage: function(businessId){
		if(!!businessId){
			return false;
		}
		return true;
	},

	getBusinessName: function(businessId){
		return (Businesses.findOne({_id: businessId}) || {}).name;
	},

	getAllBusinessesWithoutSupportChats: function(){
		let allBusinesses = Businesses.find({}).fetch();
		let allBusinessIds = _.pluck(allBusinesses, "_id");

		let allConversations = Maestro.Messages.GetAllSupportConversations() || [];
		let allConversationsBusinessIds = _.pluck(allConversations, "businessId");
		allConversationsBusinessIds = _.uniq(allConversationsBusinessIds);

		let allRemainingBusinesses = _.difference(allBusinessIds, allConversationsBusinessIds);
		allRemainingBusinessesObjects = _.map(allRemainingBusinesses, function(businessId){return {businessId: businessId};});

		return allRemainingBusinessesObjects;
	},

	getMessageTime: function(){
		let messageDate = this.createdAt;
		return messageDate.toDateString() + ", " + messageDate.toLocaleTimeString();
	},

	getLatestMessageInConversation: function(){
		let conversation = this;
		return Maestro.Messages.GetLatestMessageInConversation(conversation._id);
	},

});

Template.AllSupportConversations.events({
	'click .startNewSupportConversation': function(event, template){
		Maestro.Admiral.Messages.StartSupportConversation(this.businessId);
	},

	'click .openConversation': function(event, template){
		template.selectedConversation.set(this);
	},

	'click .exitConversation': function(event, template){
		template.selectedConversation.set(null);
	},

	'click #sendMessageButton': function(event, template){
		let conversation = template.selectedConversation.get();
		let messageText = document.getElementById("messageTextInput").value;
		Maestro.Admiral.Messages.SendSupportMessage(conversation._id, messageText);

		document.getElementById("messageTextInput").value = "";
	},

	'click .deleteThisMessage': function(event, template){
		Maestro.Admiral.Messages.DeleteThisMessage(this._id);
	}
});