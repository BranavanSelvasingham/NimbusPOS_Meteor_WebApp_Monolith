// Meteor.subscribe('reminders');

Tracker.autorun(function (computation) {
    Meteor.subscribe("reminders", UserSession.get(Maestro.UserSessionConstants.BUSINESS_ID));
});