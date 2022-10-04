// Meteor.subscribe('products');

Tracker.autorun(function (computation) {
    Meteor.subscribe("products", UserSession.get(Maestro.UserSessionConstants.BUSINESS_ID));
});
