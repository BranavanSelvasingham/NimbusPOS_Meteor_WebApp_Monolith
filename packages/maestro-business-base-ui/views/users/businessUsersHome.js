Maestro.Templates.BusinessUsersHome = "BusinessUsersHome";

let modalOptions = {
    dismissible: true,
    opacity: .6,
    in_duration: 100,
    out_duration: 100,
    complete: function () {
        $('.lean-overlay').remove();
    }
};

let _findBusinessUsers = function (query) {
    let users = Meteor.users.find(query, {
        sort: ["profile.firstName", "profile.firstName", "username"],
        transform: function (user) {
            let businessUser = BusinessUsers.findOne({userId: user._id});

            user.status = businessUser && businessUser.status || null;
            user.role = businessUser && businessUser.role || null;
            user.persona = businessUser && businessUser.persona || [];

            return user;
        }
    });

    return users.fetch();
};

Template.BusinessUsersHome.onCreated(function () {
    var template = this;

    template.selectedUser = new ReactiveVar();
    template.selectedUser.set(_findBusinessUsers({_id: Meteor.userId()})[0]);
});

Template.BusinessUsersHome.helpers({
    businessUsers: function () {
        let users = Meteor.users.find({}, {
            sort: ["profile.firstName", "profile.firstName", "username"],
            transform: function (user) {
                let businessUser = BusinessUsers.findOne({userId: user._id});

                user.status = businessUser && businessUser.status || null;
                user.role = businessUser && businessUser.role || null;
                user.persona = businessUser && businessUser.persona || [];

                return user;
            }
        });

        return users.fetch();
    },
    selectedUser: function () {
        return Template.instance().selectedUser.get();
    },
    isSelected: function () {
        selectedUser = Template.instance().selectedUser.get();
        return (selectedUser && selectedUser._id === this._id) ? "active" : "";
    },
    isCurrentUser: function () {
        return this._id === Meteor.userId();
    }
});

Template.BusinessUsersHome.events({
    'click .business-user-select': function (event, template) {
        event.preventDefault();

        template.selectedUser.set(this);
    },
    'click #change-user-password': function (event, template) {
        event.preventDefault();

        $('#change-user-password-modal').openModal(modalOptions);
    },
    'blur #confirm-new-password': function(event, template) {
        Maestro.Client.toggleValidationClass("#confirm-new-password", $("#confirm-new-password").val() === $("#new-password").val());
    },
    'click #submit-change-user-password': function (event, template) {
        event.preventDefault();

        let selectedUser = template.selectedUser.get();
        let newPassword = template.find("#new-password").value;
        let confirmNewPassword = template.find("#confirm-new-password").value;

        if(selectedUser && newPassword) {
            if(confirmNewPassword === newPassword) {
                Meteor.call("changeBusinessUserPassword", selectedUser._id, newPassword, function (error, result) {
                    if (error || !result.success) {
                        var reason = error && error.reason || "";
                        Materialize.toast("Password could not be updated! " + reason, 4000);
                    } else {
                        Materialize.toast("Password updated", 4000);
                    }
                });
            } else {
                Materialize.toast("Passwords do not match!", 4000);
                Maestro.Client.toggleValidationClass("#confirm-new-password", false);
            }
        } else {
            Materialize.toast("Password not provided!", 4000);
            Maestro.Client.toggleValidationClass("#new-password", false);
        }
    }
});