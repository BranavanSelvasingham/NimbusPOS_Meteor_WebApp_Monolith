// Meteor.subscribe('customers');

Tracker.autorun(function (computation) {
    Meteor.subscribe("customers", UserSession.get(Maestro.UserSessionConstants.BUSINESS_ID));
});