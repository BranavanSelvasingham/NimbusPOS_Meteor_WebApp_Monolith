Maestro.Templates.ListBusinessUsers = "ListBusinessUsers";

Template.ListBusinessUsers.helpers({
    businessUsers: function () {
        return Meteor.users.find({});
    }

});