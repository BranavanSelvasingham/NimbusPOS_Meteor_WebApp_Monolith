let loggedIn = function() {
    if( !Meteor.loggingIn() && !Meteor.userId() ) {
        route = FlowRouter.current();

        if(route.route.name != Maestro.route.Root
            && route.route.name != Maestro.route.Home
            && route.route.name != Maestro.route.Login
            && route.route.name != Maestro.route.Signup) {
            Session.set("redirectAfterLogin", route.path);
        }

        if(route.route.name != Maestro.route.Signup
            && route.route.name != Maestro.route.EnterHours) {
            FlowRouter.go(Maestro.route.Home);
        }
    }
};

let resumeRouteOnLogin = function() {
    if(Maestro.Client.isBusinessSelected()){
        route = FlowRouter.current();

        redirect = Session.get("redirectAfterLogin");
        if(redirect) {
            if(redirect != Maestro.route.Login &&
                redirect != Maestro.route.EnterHours) {
                Session.set("redirectAfterLogin", null);
                FlowRouter.go(redirect);
            }
        } else {
            if(route.route.name != Maestro.route.EnterHours){
                Maestro.Client.goToUserHome();
            }
        }
    } else {
        FlowRouter.go(Maestro.route.SelectBusiness);
    }
};

Maestro.Client.goToPosHome = function() {
    let route = FlowRouter.current();

    if(route.route.name != Maestro.route.Root 
        && route.route.name != Maestro.route.Home){
        // && route.route.name != Maestro.route.Settings){
        FlowRouter.go(Maestro.route.Home);
    }  
};

Maestro.Client.isBusinessSelected = function(){
    return !! Maestro.Business.getBusinessId();
};

Maestro.Client.isDeviceEnabled = function(){
    let businessId = Maestro.Business.getBusinessId();
    let localAppId = UserSession.get(Maestro.UserSessionConstants.LOCAL_APP_ID);
    let business = Businesses.findOne({_id: businessId});

    let currentAppObj = {appId: localAppId};
    
    if (business && localAppId){
        if(business.devices){
            let allAppIds = _.pluck(business.devices, 'appId');
            let containsIndex = _.indexOf(allAppIds, localAppId);
            if (containsIndex > -1){
                if(business.devices[containsIndex].posEnabled == true){
                    return true;
                }
            }
        }
    }

    return false;
};

let deviceEnabled = function() {
    if(!Maestro.Client.isDeviceEnabled()) {
        FlowRouter.go(Maestro.route.Home);
    } else if(UserSession.get(Maestro.UserSessionConstants.WAITER_LOCK) && !UserSession.get(Maestro.UserSessionConstants.SELECT_EMPLOYEE)){
        console.log('flowrouter path trigger redirecting to waiter login');
        FlowRouter.go('/waiterLogin');
    }
};

let waiterSelected = function(){
    // let businessId = Maestro.Business.getBusinessId();
    // let business = Businesses.findOne({_id: businessId});
    // // console.log('business object: ', business);
    // if(business){
    //     if (business.configuration){
    //         if (business.configuration.enableWaiterPinLock){
    //             if (business.configuration.enableWaiterPinLock == true){
    //                 if(!UserSession.get(Maestro.UserSessionConstants.SELECT_EMPLOYEE)){
    //                     FlowRouter.go('/waiterLogin');
    //                 }
    //             }
    //         }
    //     }
    // }  

    if(UserSession.get(Maestro.UserSessionConstants.WAITER_LOCK)){
        if(!UserSession.get(Maestro.UserSessionConstants.SELECT_EMPLOYEE)){
            console.log('flowrouter trigger redirecting to waiter login');
            FlowRouter.go('/waiterLogin');
        }
    }
};

Maestro.Client.goToUserHome = function(){
    let loggedInUser = Meteor.user();
    let targetRouteName = null;

    if(Maestro.Client.isCordova){
        let approvedDevice = Maestro.Client.isDeviceEnabled();

        if(loggedInUser && approvedDevice) {
            if(UserSession.get(Maestro.UserSessionConstants.WAITER_LOCK) && !UserSession.get(Maestro.UserSessionConstants.SELECT_EMPLOYEE)){
                console.log('flowrouter gotohome redirecting to waiter login');
                FlowRouter.go('/waiterLogin');
            } else { 
                FlowRouter.go(Maestro.route.Orders);
            }
        } else {
            BlazeLayout.render("Layout", {content: Maestro.Templates.Home});
        }
    } else {
        if(loggedInUser) {
            if(Maestro.Client.isBusinessSelected()){
                targetRouteName = Maestro.route.Business;

                if (Roles.userIsInRole(loggedInUser, Maestro.roles.BUSINESS_ADMIN)) {
                    targetRouteName = Maestro.route.Business;
                } else if (Roles.userIsInRole(loggedInUser, Maestro.roles.BUSINESS_ACCOUNTANT)) {
                    targetRouteName = Maestro.route.BusinessAccounts;
                } else if (Roles.userIsInRole(loggedInUser, Maestro.roles.BUSINESS_CUSTOMER)) {
                    targetRouteName = Maestro.route.Customer;
                } else if (Roles.userIsInRole(loggedInUser, Maestro.roles.LOCATION_ADMIN)) {
                    targetRouteName = Maestro.route.Business;
                } else if (Roles.userIsInRole(loggedInUser, Maestro.roles.BUSINESS_USER)) {
                    targetRouteName = Maestro.route.Orders;
                }

                FlowRouter.go(targetRouteName);
            } else {
                FlowRouter.go(Maestro.route.SelectBusiness);
            }
        } else {
            BlazeLayout.render("Layout", {content: Maestro.Templates.Home});
        }
    }
};

let redirectToLogin = function() {
    FlowRouter.go(Maestro.route.Home);
};

if(Meteor.isCordova){
    
    FlowRouter.triggers.enter([deviceEnabled], {except: [Maestro.route.Logout, Maestro.route.Home, Maestro.route.Login, Maestro.route.Signup]});

    // FlowRouter.triggers.enter([waiterSelected], {except: [Maestro.route.WaiterLogin]});

} else {
    //resume route on user login
    // Maestro.Users.onLogin(resumeRouteOnLogin);

    FlowRouter.triggers.enter([loggedIn], {except: [Maestro.route.Root, Maestro.route.Login, Maestro.route.Signup]});

    // FlowRouter.triggers.enter([waiterSelected], {except: [Maestro.route.WaiterLogin]}); //for testing only
}

Maestro.Users.onLoginFailure(redirectToLogin);

Maestro.Users.onLogout(redirectToLogin);

FlowRouter.notFound = {
    action: function () {
        FlowRouter.go(Maestro.route.Home);
    }
};