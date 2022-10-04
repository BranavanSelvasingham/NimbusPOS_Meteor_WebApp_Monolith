Maestro.Templates.CreateBusiness = "CreateBusiness";

var businessInfo = new ReactiveVar();

Template.CreateBusiness.onCreated(function () {
    this.loading = new ReactiveVar(false);
});

Template.CreateBusiness.helpers({
    datamain: function(){

    },
    loading: function () {
        return Template.instance().loading.get();
    },
    userNotCreated: function(){
        return !Meteor.userId();
    }
});

Template.CreateBusiness.events({
    // 'blur #business-name': function(event, template) {
    //     Meteor.call("businessExists", template.find("#business-name").value, function(error, result) {
    //         Maestro.Client.toggleValidationClass("#business-name", (error || !result));
    //     });
    // },
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
        // if(email) {
        //     Maestro.Users.userExistsByEmail(email, function (error, result) {
        //         Maestro.Client.toggleValidationClass("#email", (error || !result));
        //     });
        // }
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
    'submit #create-owner': function(event, template) {
        event.preventDefault();

        let firstName = template.find("#first-name").value,
            lastName = template.find("#last-name").value,
            // businessName = template.find("#business-name").value,
            username = template.find("#user-name").value,
            email = template.find("#email").value,
            password = template.find("#password").value,
            confirmPassword = template.find("#confirm-password").value;

        if(confirmPassword === password) {
            template.loading.set(true);

            let userId = Maestro.Users.createUser({username, password, email, firstName, lastName}, function(error) {
                if(!error) {
                    Materialize.toast("User account successfully created. Welcome!", 4000, "rounded green");

                    // let business = {
                    //     name: businessName
                    // };

                    Meteor.loginWithPassword(username, password, function(error) {
                        if (error){
                            console.log('login error: ', error);
                        } else {
                            Meteor.call("createBusinessAdminUser", function (error, result) {
                                if (error) {
                                    Materialize.toast("Business user creation failed. Try Again!", 4000, "rounded red");

                                    console.log(error);
                                    template.loading.set(false);
                                } else {
                                    Materialize.toast("Business account successfully created.", 4000, "rounded green");
                                    // businessInfo.set(result);
                                    console.log('business user created: ', result);
                                    console.log('user: ', Meteor.user());
                                    // UserSession.set(Maestro.UserSessionConstants.BUSINESS_ID, businessInfo.get().businessId);
                                    template.loading.set(false);

                                    //Maestro.Users.logoutUser();
                                    FlowRouter.go(Maestro.route.Home);
                                    // window.setTimeout(function(){location.reload();},1000);
                                }
                            });
                        }
                    });
                }
                template.loading.set(false);
            });

        } else {
            Maestro.Client.toggleValidationClass("#confirm-password", false);
        }
    }

});