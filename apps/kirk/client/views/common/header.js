Maestro.Templates.AppHeader = "AppHeader";

let sideMenuNavOptions = {
    closeOnClick: true,
    menuWidth: 600,
    edge: 'left',
    draggable: false
};

Template.AppHeader.onCreated(function(){

    var template = this;

    template.selectedEmployee = new ReactiveVar();

    template.openNavUnderlay = function(){
        document.getElementById("sideNavMenuUnderlay").style.width = "100%";
        document.getElementById("sideNavMenuUnderlay").style.height = "100%";
    };

    template.closeNavUnderlay = function(){
        document.getElementById("sideNavMenuUnderlay").style.width = "0";
        document.getElementById("sideNavMenuUnderlay").style.height = "0";
    };

    template.openNav = function(){
        document.getElementById("sideNavMenu").style.top = "75px";
        document.getElementById("sideNavMenu").style.left = "2.5%";
        document.getElementById("sideNavMenu").style.width = "95%";
        document.getElementById("sideNavMenu").style.height = "75%";
    };

    template.closeNav = function(){
        document.getElementById("sideNavMenu").style.top = "0";
        document.getElementById("sideNavMenu").style.left = "0";
        document.getElementById("sideNavMenu").style.width = "0";
        document.getElementById("sideNavMenu").style.height = "0";
    };
});

Template.AppHeader.onRendered(function() {
    let template = this;

    this.autorun(function() {
        if(Meteor.userId()) {
            dropdownOptions = {
                constrain_width: false,
                belowOrigin: true,
                alignment: 'right'
            };

            if(Maestro.Client.isCordova) {
                $("#location-selection").dropdown(dropdownOptions);
                $("#location-selection-small").dropdown(dropdownOptions);
            }
            $("#nav-selection").dropdown(dropdownOptions);

            $("#sidebar-toggle").sideNav(sideMenuNavOptions);

            $(".collapsible").each(function (index, element) {
                $(element).collapsible({ accordion: false });
            });
        }
    });

    if(Maestro.Client.isCordova) {
        this.autorun(function(){
            let businessId = Maestro.Business.getBusinessId();
            let business = Businesses.findOne({_id: businessId});
            if(business){
                if (business.configuration){

                    if (business.configuration.enableWaiterPinLock == true){
                        UserSession.set(Maestro.UserSessionConstants.WAITER_LOCK, true);
                    } else {
                        UserSession.set(Maestro.UserSessionConstants.WAITER_LOCK, false);
                    }
                    
                }
            }  
        });

        this.autorun(function(){
            if(UserSession.get(Maestro.UserSessionConstants.WAITER_LOCK)){
                if(!UserSession.get(Maestro.UserSessionConstants.SELECT_EMPLOYEE)){
                    console.log('header redirecting to waiter login');
                    FlowRouter.go('/waiterLogin');
                }
            }
        })
    }
});

Template.AppHeader.helpers({
    noConnection: function(){
        return !Meteor.status();
    },

    userId: function() {
        return Meteor.userId();
    },
    isBusinessUser: function(){
        if (BusinessUsers.findOne({userId: Meteor.userId()})){
            return true;
        } else {
            return false;
        }
    },

    getBusinessName: function(){
        return Maestro.Business.getBusinessName();
    },
    selectedMenu: function() {
        return Session.get("selected-menu");
    },
    selectedLocation: function(){
        return Maestro.Business.getLocationName();
    },
    hiddenClass: function() {
        return Meteor.userId() ? "" : "hide";
    },
    appMenu: function () { 
        return Maestro.Client.Menu;
    },
    groupMenu: function(groupName){
        return Maestro.Client.MenuGroups(groupName);
    },
    getOrderedGroupMenuNames: function(){
        return Maestro.Client.AllMenuGroupNamesOrdered;
    },
    isItSingleLocation: function(){
        let locations = Locations.find({}).fetch();
        if (locations.length == 1){
            Maestro.Client.selectLocation(locations[0]);
        }
    },

    getDeviceLocation: function(){
        let business = Maestro.Business.getBusiness();
        let localAppId = UserSession.get(Maestro.UserSessionConstants.LOCAL_APP_ID);
        let currentAppObj = {appId: localAppId};

        let existingDevice = _.find(business.devices || [], function(registeredDevice) {
            return registeredDevice.appId == currentAppObj.appId;
        });
        
        let locations = Locations.find({}).fetch();

        if (locations.length == 1){
            Maestro.Client.selectLocation(locations[0]);
        } else if(!!existingDevice) {
            if(!!existingDevice.selectedLocation){
                let location = Locations.findOne({_id: existingDevice.selectedLocation});
                Maestro.Client.selectLocation(location);
            }
        }
    },

    initHeader: function(){
        window.setTimeout(function(){
            dropdownOptions = {
                constrain_width: false,
                belowOrigin: true,
                alignment: 'right'
            };

            $("#location-selection").dropdown(dropdownOptions);
            $("#location-selection-small").dropdown(dropdownOptions);
            // $("#employee-selection").dropdown(dropdownOptions);
            $("#nav-selection").dropdown(dropdownOptions);
            $("#show-location-selection").dropdown(dropdownOptions);
            //$("#action-selection").dropdown(dropdownOptions);

            $("#sidebar-toggle").sideNav(sideMenuNavOptions);

            $(".collapsible").each(function (index, element) {
                $(element).collapsible();
            });
        }, 100);
    },

    showBusinessHeader: function () {
        let businessSelected = !!Maestro.Business.getBusinessId();

        if(Maestro.Client.isCordova) {
            if(businessSelected && Maestro.Client.isDeviceEnabled()) { 
                return true;
            } else {

                route = FlowRouter.current();
                if(route.route.name != Maestro.route.Root &&
                    route.route.name != Maestro.route.Home &&
                    route.route.name != Maestro.route.Signup){
                    FlowRouter.go(Maestro.route.Home);
                }
                return false;
            }
        } else {
            return businessSelected;
        }
    },

    isOrderEntry: function () {
        return FlowRouter.getRouteName() === "Orders" || FlowRouter.getRouteName() === "EditOrder";
    },

    getSystemEmployee: function(){
        return UserSession.get(Maestro.UserSessionConstants.SELECT_EMPLOYEE);
    },
});

Template.AppHeader.events({
    'click .location-select-ids': function(event, template) {
        event.preventDefault();

        Maestro.Client.selectLocationId($(event.currentTarget).data("locationId"));
        Maestro.Client.selectLocationName($(event.currentTarget).data("locationName")); 
    },

    'click .openNav': function(event, template) {
        if(document.getElementById("sideNavMenu").style.width=="95%"){
            template.closeNav();
            template.closeNavUnderlay();
        } else {
            template.openNavUnderlay();
            template.openNav();            
        }

        // console.log("BusinessUsers: ", BusinessUsers.find({}).fetch().length);
        // console.log("Customers: ", Customers.find({}).fetch().length);
        // console.log("Employees: ", Employees.find({}).fetch().length);
        // console.log("Expenses: ", Expenses.find({}).fetch().length);
        // console.log("Invoices: ", Invoices.find({}).fetch().length);
        // console.log("Locations: ", Locations.find({}).fetch().length);
        // console.log("LoyaltyPrograms: ", LoyaltyPrograms.find({}).fetch().length);
        // console.log("LoyaltyCards: ", LoyaltyCards.find({}).fetch().length);
        // console.log("Notes: ", Notes.find({}).fetch().length);
        // console.log("Orders: ", Orders.find({}).fetch().length);
        // console.log("ProductAddons: ", ProductAddons.find({}).fetch().length);
        // console.log("ProductCategories: ", ProductCategories.find({}).fetch().length);
        // console.log("Products: ", Products.find({}).fetch().length);
        // console.log("Reminders: ", Reminders.find({}).fetch().length);
        // console.log("Tables: ", Tables.find({}).fetch().length);
    },

   'click .closeNav': function(event, template) {
        template.closeNav();
        template.closeNavUnderlay();
    },

    'click #openTill': function(event, template){
        Maestro.Order.OpenDrawer();
    },

});

