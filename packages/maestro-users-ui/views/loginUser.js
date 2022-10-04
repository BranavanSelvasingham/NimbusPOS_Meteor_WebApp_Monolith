Maestro.Templates.LoginUser = "LoginUser";

Template.LoginUser.onCreated(function(){
    this.loginMessage = new ReactiveVar;
    this.loginMessage.set("");
});

Template.LoginUser.helpers({
    message: function() {
        return Template.instance().loginMessage.get();
    }
});

Template.LoginUser.events({
    'click #submit-sign-in': function(event, template) {
        event.preventDefault();

        var userName = template.find("#user-name").value,
            password = template.find("#password").value;

        Meteor.loginWithPassword(userName, password, function(error) {
            if(error) {
                template.loginMessage.set(error.reason);
                Materialize.toast("Login failed! Please try again.", 4000, "rounded red");
            }
        });
    }
});