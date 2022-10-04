Maestro.Users = {
    loginHooks: new Set(),
    loginFailureHooks: new Set(),
    logoutHooks: new Set(),

    onLogin: function(fn) {
        if(fn && typeof fn === 'function') {
            Maestro.Users.loginHooks.add(fn);
        }
    },

    onLoginFailure: function(fn) {
        if(fn && typeof fn === 'function') {
            Maestro.Users.loginFailureHooks.add(fn);
        }
    },

    onLogout: function(fn) {
        if(fn && typeof fn === 'function') {
            Maestro.Users.logoutHooks.add(fn);
        }
    },

    checkUserLogin(attempt) {
        // console.log("logging in user:" + attempt.user);
        if (attempt.user){
            if (attempt.user.loginDisabled == true){ //if user account is diabled
                return false;
            }
            if (attempt.user.isEndCustomer == true){ //if user is an end customer and not a business user
                return false;
            }
        }
        return true;
    },

    logoutUser(fn) {
        UserSession.set(Maestro.UserSessionConstants.LOCATION_ID, null);
        UserSession.set(Maestro.UserSessionConstants.LOCATION_NAME, null);
        // UserSession.set(Maestro.UserSessionConstants.ORDERS_VIEW_TYPE, null);
        // UserSession.set(Maestro.UserSessionConstants.POS_START_ORDER_TYPE, null);
        UserSession.set(Maestro.UserSessionConstants.SELECT_EMPLOYEE, null);

        Maestro.Users.onLogout(fn);

        Meteor.logout(function () {
            Maestro.Users.logoutHooks.forEach((customFunction) => { customFunction.apply(this, arguments); });
        });

        Maestro.Client.goToUserHome();
    },

    createUser: function(userDetails, callbackFunction) {
        let {username, password, email, firstName, lastName} = userDetails;

        check(username, String);
        check(password, String);
        check(email, Match.Optional(String));
        check(firstName, Match.Optional(String));
        check(lastName, Match.Optional(String));

        let user = {
            username: username,
            password: password,
            email: email
        };

        let userProfile = _.extend({}, _.omit(userDetails, ["username", "password", "email"]));
        user.profile = userProfile;

        console.log("CREATE BASE USER: ", user);
        return Accounts.createUser(user, callbackFunction);
    },

    changePassword: function(userId, password) {
        check(userId, String);
        check(password, String);

        //todo permission checks
        Accounts.setPassword(userId, password);
    },

    findUserByUsername: function(username, callbackFunction) {
        Meteor.call("users.find.by.username", username, function(error, result) {
            callbackFunction.apply(null, [error, result]);
        });
    },

    userExistsByUsername: function(username, callbackFunction) {
        Meteor.call("users.exists.by.username", username, function(error, result) {
            callbackFunction.apply(null, [error, result]);
        });
    },

    findUserByEmail: function(email, callbackFunction) {
        Meteor.call("users.find.by.email", email, function(error, result) {
            callbackFunction.apply(null, [error, result]);
        });
    },

    userExistsByEmail: function(email, callbackFunction) {
        Meteor.call("users.exists.by.email", email, function(error, result) {
            callbackFunction.apply(null, [error, result]);
        });
    }
};

Accounts.onLogin(function(user) {
    Maestro.Users.loginHooks.forEach((customFunction) => { customFunction.apply(this, arguments); });
});

Accounts.onLoginFailure(function() {
    Maestro.Users.loginFailureHooks.forEach((customFunction) => { customFunction.apply(this, arguments); });
});

