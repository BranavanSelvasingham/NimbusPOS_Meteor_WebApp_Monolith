Tracker.autorun(function (computation) {
    Meteor.subscribe("loyalty-cards", UserSession.get(Maestro.UserSessionConstants.BUSINESS_ID));
});