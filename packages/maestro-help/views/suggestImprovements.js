Maestro.Templates.SuggestImprovements = "SuggestImprovements";

Template.SuggestImprovements.onRendered(function(){

});

Template.SuggestImprovements.helpers({

});

Template.SuggestImprovements.events({
	'click #sendSuggestion': function(event, target){
		var fromEmail = document.getElementById('contact_Info').value;
		var messageBody = document.getElementById('suggestion_Box').value;

		Meteor.call('submitSuggestion', fromEmail, messageBody, function(error, result){
			if (error){
				console.log("error: ", error)
			} else {
				Materialize.toast("Sent Suggestion",1000);
			}
		})

		document.getElementById('sendFeedback').reset();
		FlowRouter.go("/help");
	},

	'click #cancelSuggestion': function(event, target){
		document.getElementById('sendFeedback').reset();
		FlowRouter.go("/help");
	}


});