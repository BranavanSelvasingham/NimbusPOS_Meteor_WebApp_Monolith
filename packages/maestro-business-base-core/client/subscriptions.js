Meteor.subscribe("user-businesses");

Tracker.autorun(function (computation) {
    Meteor.subscribe("business-core-information", UserSession.get(Maestro.UserSessionConstants.BUSINESS_ID));
});