// Accounts.onCreateUser(function (options, user) {
//     if(user && user._id) {
//         Meteor.defer(function() {
//             Accounts.sendVerificationEmail(user._id);
//         });
        /*
        _.each(
            _.pluck(
                _.filter(user.emails,
                    function (emailObject) {
                        return !emailObject.verified;
                    }
                ),
                "address"
            ),
            function (email) {
                Meteor.defer(function() {
                    Accounts.sendVerificationEmail(user._id, email);
                });
            }
        );
        */
//     }

//     return user;
// });