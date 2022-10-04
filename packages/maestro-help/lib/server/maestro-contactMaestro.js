Maestro.ContactUs = {};
Maestro.ContactUs.Suggestion = {};

var _submitSuggestion = function(fromEmail, messageBody ){
	var toEmail =["info@nimbuspos.com"];
	var subjectLine = "A suggestion to make Nimbus POS better";

	Maestro.Notifications.Email.Send(toEmail, fromEmail, subjectLine, messageBody);

};

Maestro.ContactUs.Suggestion.Send = _submitSuggestion;