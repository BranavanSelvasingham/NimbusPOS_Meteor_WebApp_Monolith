Accounts.onEmailVerificationLink(function (token, done) {
    Accounts.verifyEmail(token);
});
