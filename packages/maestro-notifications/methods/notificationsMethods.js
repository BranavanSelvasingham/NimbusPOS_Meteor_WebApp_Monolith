Meteor.methods({
	sendEmail: function(toEmail, fromEmail, subjectLine, messageBody, htmlBody){
		Maestro.Notifications.Email.Send(toEmail, fromEmail, subjectLine, messageBody, htmlBody);
	},

});