subscribeBusinessCollection = function(name) {
    Tracker.autorun(function (computation) {
    	console.log('subscribe params');
    	console.log(name, UserSession.get(Maestro.UserSessionConstants.BUSINESS_ID));
        Meteor.subscribe(name, UserSession.get(Maestro.UserSessionConstants.BUSINESS_ID));
    });
};

Maestro.subscribe = subscribeBusinessCollection;