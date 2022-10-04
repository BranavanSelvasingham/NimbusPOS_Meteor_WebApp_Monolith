// Meteor.subscribe('orders');

// Tracker.autorun(function (computation) {
//     Meteor.subscribe("orders", UserSession.get(Maestro.UserSessionConstants.BUSINESS_ID));
// });


Tracker.autorun(function(){
    let businessId = UserSession.get(Maestro.UserSessionConstants.BUSINESS_ID);
    let locationId = UserSession.get(Maestro.UserSessionConstants.LOCATION_ID);
    let limit = 5;
    Meteor.subscribe('orders-limit', businessId, limit);
    Meteor.subscribe('orders-location-specific', businessId, locationId, limit);
});