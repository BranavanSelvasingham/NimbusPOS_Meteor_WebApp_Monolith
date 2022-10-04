import { Accounts } from 'meteor/accounts-base';

Accounts.emailTemplates.siteName = 'My Nimbus';

Accounts.emailTemplates.from = 'My Nimbus <do-not-reply@nimbuspos.com>';

Accounts.emailTemplates.verifyEmail = {
   subject() {
      return "Please verify your email";
   },
   text(user, url) {
      return "Hi! Please verify your e-mail by following this link: " + url + ".  If you did not request to register with us or you feel you received this email in error, please contact: info@nimbuspos.com.";
   }
};

Accounts.onEmailVerificationLink = function(token, done){
	Accounts.verifyEmail(token, function(error){
		if(!error){
			console.log("verified");
		}
	});
};

Accounts.validateLoginAttempt(function(attempt){
   if (attempt.user){
      if (attempt.user.loginDisabled == true){ //if user account is diabled
          return false;
      }
   }
   return true;
});