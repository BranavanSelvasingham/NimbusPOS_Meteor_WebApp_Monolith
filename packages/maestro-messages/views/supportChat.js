Maestro.Templates.SupportChat = "SupportChat";

Template.SupportChat.onCreated(function(){
	Template.instance().subscribe("support-conversations", UserSession.get(Maestro.UserSessionConstants.BUSINESS_ID));

	let template = this;

	template.selectedConversation = new ReactiveVar();

	template.autorun(function(){
		let allConversations = Conversations.find({}).fetch();
		if (allConversations.length == 1){
			template.selectedConversation.set(allConversations[0]);
		}
	});

	template.autorun(function(){
		if(!!template.selectedConversation.get())
		Template.instance().subscribe("messagesInConversation", template.selectedConversation.get()._id);
	});

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

Template.SupportChat.onRendered(function(){

});

Template.SupportChat.helpers({
	isSystemIsOnline: function(){
		return Meteor.status().connected;
	},

	getSelectedConversation: function(){
		return Template.instance().selectedConversation.get();
	},

	getAllConversations: function(){
		return Maestro.Messages.GetAllSupportConversations();
	},

	getAllMessagesInConversation: function(){
		let conversation = Template.instance().selectedConversation.get() || {};
		return Maestro.Messages.GetAllMessagesInConversation(conversation._id);
	},

	isYourMessage: function(businessId){
		if(businessId == Maestro.Business.getBusinessId()){
			return true;
		}
		return false;
	},

	getMessageTime: function(){
		let messageDate = this.createdAt;
		return messageDate.toDateString() + ", " + messageDate.toLocaleTimeString();
	}
});

Template.SupportChat.events({
	'click .startSupportChat': function(event, template){
		Maestro.Messages.StartSupportConversation();
	},

	'click .openConversation': function(event, template){
		template.selectedConversation.set(this);
	},

	'click #sendMessageButton': function(event, template){
		let conversation = template.selectedConversation.get();
		let messageText = document.getElementById("messageTextInput").value;
		Maestro.Messages.SendSupportMessage(conversation._id, messageText);

		document.getElementById("messageTextInput").value = "";
	}
});