Maestro.Templates.AddBusinessUser = "AddBusinessUser";

Template.AddBusinessUser.events({
    'blur #user-name': function(event, template) {
        var username = template.find("#user-name").value;
        if(username) {
            Maestro.Users.userExistsByUsername(username, function (error, result) {
                if (!error) {
                    Maestro.Client.toggleValidationClass("#user-name", !result);
                }
            });
        }
    },
    'blur #email': function(event, template) {
        var email = template.find("#email").value;
        if (email) {
            Maestro.Users.userExistsByEmail(email, function (error, result) {
                if (!error) {
                    Maestro.Client.toggleValidationClass("#email", !result);
                }
            });
        }
    },
    'blur #confirm-password': function(event, template) {
        Maestro.Client.toggleValidationClass("#confirm-password", $("#confirm-password").val() === $("#password").val());
    },
    'click #submit-add-business-user': function (event, template) {
        event.preventDefault();

        var firstName = template.find("#first-name").value,
            lastName = template.find("#last-name").value,
            userName = template.find("#user-name").value,
            email = template.find("#email").value,
            password = template.find("#password").value;

        var user = {
            username: userName,
            password: password,
            profile: {
                firstName: firstName,
                lastName: lastName,
                businessId: Maestro.Client.businessId()
            }
        };

        if(email) {
            user.email = email;
        }

        Meteor.call("createBusinessUser", user, function(error, result) {
            if(error) {
                Materialize.toast("User could not be created!", 4000);
            } else {
                Materialize.toast("Successfully added user!", 4000);
            }

            FlowRouter.go(Maestro.route.Users);
            // location.reload();

        });
    }
});