Maestro.Templates.CreateUser = "CreateUser";

Template.CreateUser.helpers({
    datamain: function(){

    }
});

Template.CreateUser.events({
    'blur #user-name': function(event, template) {
        event.preventDefault();

        let userName = template.find("#user-name").value;
        if(userName) {
            Maestro.Users.userExistsByUsername(userName, function (error, result) {
                Maestro.Client.toggleValidationClass("#user-name", (error || !result));
            });
        }
    },
    'blur #email': function(event, template) {
        event.preventDefault();

        let email = template.find("#email").value;
        if(email) {
            Maestro.Users.userExistsByEmail(email, function (error, result) {
                Maestro.Client.toggleValidationClass("#email", (error || !result));
            });
        }
    },
    'blur #confirm-password': function(event, template) {
        event.preventDefault();

        let password = template.find("#password").value,
            confirmPassword = template.find("#confirm-password").value;

        if(confirmPassword === password) {
            Maestro.Client.toggleValidationClass("#confirm-password", true);
        } else {
            Maestro.Client.toggleValidationClass("#confirm-password", false);
        }
    },
    'submit #create-user': function(event, template) {
        event.preventDefault();

        let firstName = template.find("#first-name").value,
            lastName = template.find("#last-name").value,
            userName = template.find("#user-name").value,
            email = template.find("#email").value,
            password = template.find("#password").value,
            confirmPassword = template.find("#confirm-password").value;

        if(confirmPassword === password) {
            let userId = Maestro.Users.createUser(userName, password, email, firstName, lastName);
            if (userId) {
                Meteor.loginWithPassword(userName, password);
            }
        } else {
            Maestro.Client.toggleValidationClass("#confirm-password", false);
        }
    }

});