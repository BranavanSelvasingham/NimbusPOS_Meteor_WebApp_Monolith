Meteor.methods({
    "users.find.by.username": function(username) {
        check(username, String);

        if(!this.isSimulation) {
            return Accounts.findUserByUsername(username);
        }
    },

    "users.find.by.email": function(email) {
        check(email, String);

        if(!this.isSimulation) {
            return Accounts.findUserByEmail(email);
        }
    },

    "users.exists.by.username": function(username) {
        check(username, String);

        if(!this.isSimulation) {
            return !!Accounts.findUserByUsername(username);
        }
    },

    "users.exists.by.email": function(email) {
        check(email, String);

        if(!this.isSimulation) {
            return !!Accounts.findUserByEmail(email);
        }
    },

    "users.reset.password": function(userId) {
        check(userId, String);

        if(!this.isSimulation) {
            Accounts.sendResetPasswordEmail(userId);
        }
    }
});
