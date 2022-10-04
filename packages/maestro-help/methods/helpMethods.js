Meteor.methods({
    submitSuggestion: function(fromEmail, messageBody){
        if(Meteor.isServer){
            Maestro.ContactUs.Suggestion.Send(fromEmail, messageBody);
        }

    },

});    
