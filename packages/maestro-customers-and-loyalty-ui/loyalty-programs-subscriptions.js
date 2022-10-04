// Meteor.subscribe('loyalty-programs');

Tracker.autorun(function (computation) {
    Meteor.subscribe("loyalty-programs", UserSession.get(Maestro.UserSessionConstants.BUSINESS_ID));
});