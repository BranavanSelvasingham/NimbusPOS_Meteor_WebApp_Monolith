Accounts.emailTemplates.from = "no-reply@nimbuspos.com";

Accounts.emailTemplates.verifyEmail.subject = function(user) {
    return "Maestro Accounts - Verify your email";
};
Accounts.emailTemplates.verifyEmail.text = function(user, url) {
    console.log("User: ", user);
    return `Hi,
    
Kindly click on the below link to verify your email
${url}

Thanks,
A&B`;
};

//Reset password
Accounts.emailTemplates.resetPassword.subject = function(user) {
    return "Maestro Accounts - Reset password";
};
Accounts.emailTemplates.resetPassword.text = function(user, url) {
    return `Hi,
    
We have recently received request to reset your password. If you are not aware of such a request then ignore this email.

To reset your password kindly click on the below link to
${url}

Thanks,
A&B`;
};