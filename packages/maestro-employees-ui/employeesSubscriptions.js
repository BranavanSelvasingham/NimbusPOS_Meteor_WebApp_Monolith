// Meteor.subscribe("employees");

Tracker.autorun(function (computation) {
    Meteor.subscribe("employees", UserSession.get(Maestro.UserSessionConstants.BUSINESS_ID));
});