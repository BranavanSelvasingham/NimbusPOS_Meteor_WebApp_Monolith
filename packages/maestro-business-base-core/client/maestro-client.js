let resetStoredValues = function () {
    UserSession.remove(Maestro.UserSessionConstants.BUSINESS_ID);
    UserSession.remove(Maestro.UserSessionConstants.BUSINESS_NAME);
    UserSession.remove(Maestro.UserSessionConstants.LOCATION_ID);
    UserSession.remove(Maestro.UserSessionConstants.LOCATION_NAME);
};

let initializeBusinessSession = function() {
    Meteor.call("find.user.businesses", Meteor.userId(), function(error, result){
        if(!error && result) {
            if(result.length === 1) {
                Maestro.Client.selectBusiness(result[0]);
            }
        }
    });
};

//generate/load app-id
let initializeAppId = function() {
    let installId = UserSession.get(Maestro.UserSessionConstants.LOCAL_APP_ID);
    if (!installId) {
        installId = Meteor.isCordova ? device.uuid : Meteor.uuid();
        UserSession.set(Maestro.UserSessionConstants.LOCAL_APP_ID, installId);
    }
};

//generate app-id on startup
Maestro.Client.onStartup(function () {
    if(Meteor.isCordova) {
        document.addEventListener("resume", function() {
            //restore session
            UserSession.restoreSession();
        }, false);
        
        document.addEventListener("deviceready", function() {
            //restore session
            initializeAppId();
        }, false);
    }

    //load app id
    initializeAppId();

    //check session/local values
    if (!Meteor.userId()) {
        resetStoredValues();
    } else {
        initializeBusinessSession();
    }
});

//initialize business session on user login
Maestro.Users.onLogin(function () {
    initializeBusinessSession();
});

Maestro.Users.onLogout(resetStoredValues);

Maestro.Client.businessId = function () {
    // return UserSession.get(Maestro.UserSessionConstants.BUSINESS_ID);
    return Maestro.Business.getBusinessId();
};

Maestro.Client.selectBusiness = function(business) {
    if(business) {
        Maestro.Client.selectBusinessId(business._id);
        Maestro.Client.selectBusinessName(business.name);
    }
};

Maestro.Client.selectBusinessId = function(businessId) {
    if(businessId != UserSession.get(Maestro.UserSessionConstants.BUSINESS_ID)) {
        resetStoredValues();

        UserSession.set(Maestro.UserSessionConstants.BUSINESS_ID, businessId);
    }
};

Maestro.Client.selectBusinessName = function(businessName) {
    if(businessName) {
        UserSession.set(Maestro.UserSessionConstants.BUSINESS_NAME, businessName);
    }
};

Maestro.Client.selectLocation = function (location) {
    // if (location) {
        Maestro.Client.selectLocationId(location._id);
        Maestro.Client.selectLocationName(location.name);
    // }
};

Maestro.Client.selectLocationId = function (locationId) {
    // if (locationId) {
        UserSession.set(Maestro.UserSessionConstants.LOCATION_ID, locationId);
    // }
};

Maestro.Client.selectLocationName = function (locationName) {
    // if (locationName) {
        UserSession.set(Maestro.UserSessionConstants.LOCATION_NAME, locationName);
    // }
};

Maestro.Client.locationId = function () {
    return UserSession.get(Maestro.UserSessionConstants.LOCATION_ID);
};

Maestro.Client.locationName = function () {
    return UserSession.get(Maestro.UserSessionConstants.LOCATION_NAME);
};
