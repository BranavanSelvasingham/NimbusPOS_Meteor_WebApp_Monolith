Accounts.validateLoginAttempt(function(attempt){
    return Maestro.Users.checkUserLogin(attempt);
});