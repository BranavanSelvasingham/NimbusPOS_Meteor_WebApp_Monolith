// Maestro.Business = {};

Maestro.Business.Roles = {
    CUSTOMER: "customer",
    BUSINESS_ADMIN: "business-admin",
    LOCATION_ADMIN: "location-admin",
    BUSINESS_USER: "business-user",
    BUSINESS_CUSTOMER: "business-customer",
    BUSINESS_ACCOUNTANT: "business-accountant"
};

const __createHooks = new Set();
Maestro.Business.onCreateBusiness = function(fn) {
    if (fn && typeof fn !== 'function') {
        throw new Meteor.Error(
            'business-core-on-create-expected-function',
            'You must pass a function into Businesses.onCreate method');
    }

    __createHooks.add(fn);
};

Maestro.Business.runBusinessCreationHooks = function(businessId, userId) {
    __createHooks.forEach((customFunction) => {
        customFunction.apply(this, [businessId, userId]);
    });
};

Maestro.Business.isActiveBusinessUser = function(userId, businessId) {
    return !!BusinessUsers.findOne({userId, businessId, status: "A"});
};

Maestro.Business.isBusinessAdmin = function(userId, businessId) {
    return !!BusinessUsers.findOne({userId, businessId, role: Maestro.Business.Roles.BUSINESS_ADMIN});
};

Maestro.Business.businessExistsByName = function(businessName, callbackFunction) {
    Meteor.call("businessExists", businessName, function(error, result) {
        callbackFunction.apply(null, [error, result]);
    });
};

Maestro.Business.Notifications = {};

Maestro.Business.Notifications.NewAccountCreated = function(infoObject){
    let userInfo = infoObject.userInfo;
    let businessInfo = infoObject.businessInfo;
    let locationInfo = infoObject.locationInfo;

    let toEmail = "info@nimbuspos.com";
    let fromEmail = "info@nimbuspos.com";
    let subjectLine = "New Account Created for " + businessInfo.name;
    
    let messageBody = ""; 

    let notificationBody = "<h2>New Account Created!</h2>" + 
    "<h4><b>User info: </b></h4>" +
    "<h4>Name: " + userInfo.firstName + userInfo.lastName +"</h4>" +
    "<h4>Email: " + userInfo.email + "</h4>" + 
    "<h4>Username: " + userInfo.username + "</h4>" + 
    "<hr>" + 
    "<h4><b>Business Info:</b></h4>" + 
    "<h4>Name: " + businessInfo.name + "</h4>" +
    "<h4>Email: " + businessInfo.email + "</h4>" + 
    "<h4>Phone: " + businessInfo.phone + "</h4>" + 
    "<hr>" +
    "<h4><b>Location Info:</b></h4>" + 
    "<h4>Name: " + locationInfo.name + "</h4>" + 
    "<h5>" + locationInfo.address.street + "</h5>" +
    "<h5>" + locationInfo.address.city +  ", " + locationInfo.address.state + "</h5>" +
    "<h5>" + locationInfo.address.pin + ", " + locationInfo.address.country + "</h5>";

    let notificationBox = "<div style='border-style: outset; \
                                width: 350px; \
                                color: black; \
                                background-color: white; \
                                padding-top: 10px; \
                                padding-right: 10px; \
                                padding-bottom: 10px; \
                                padding-left: 20px;'>" + notificationBody + "</div>";
    // width: 300px; background-color: white; box-shadow: 5px 5px 3px #888888;
    let htmlBody = notificationBox;

    Meteor.call('sendEmail', toEmail, fromEmail, subjectLine, messageBody, htmlBody, function(error, result){
        if(error){
            // Materialize.toast('Report Email Failed To Send', 2000, 'rounded red');
        } else {
            // Materialize.toast('Report Emailed', 2000, 'rounded green');
        }
    });
};