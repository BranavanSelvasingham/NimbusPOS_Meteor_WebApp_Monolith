Maestro.Templates.CreateNewAccount = "CreateNewAccount";

var businessInfo = new ReactiveVar();

Template.CreateNewAccount.onCreated(function () {
    this.loading = new ReactiveVar(false);

    let template = this;

    template.infoObject = new ReactiveVar();
    template.infoObject.set({
        userInfo: {
            // username: "branavan21",//unique
            // password: "ablabs",
            // email: "branavan21@gmail.com",//unique
            // firstName: "branavan",
            // lastName: "selva"
        },
        businessInfo: {
            // name: "Maestro branavan21", // unique
            // email: "branavan21@gmail.com",
            // phone: "1234",
        },
        locationInfo: {
            // name: "a1",
            // // businessId: businessId,
            // address: {
            //     street: "1a",
            //     city: "b",
            //     state: "ON",
            //     pin: "M1B2X1",
            //     country: "CA"
            // }
        }
    });

    template.autorun(function(){
        if(Session.get("accountCreationProgress")){
            let progress = Session.get("accountCreationProgress");
            if(progress.userCreated && progress.businessCreated && progress.locationCreated){
                window.setTimeout(function(){
                    $('ul.tabs').tabs('select_tab', 'firstTabPostCreation');
                }, 1000);
            }
        }
    });

});

Template.CreateNewAccount.onRendered(function () {
    $('ul.tabs').tabs();
    $("#address-country").material_select();
    $("#address-state").material_select();

    Session.set("accountCreationProgress", {
        userCreated: false,
        businessCreated: false,
        locationCreated: false,
    });

    if(Meteor.loggingIn()){
        this.autorun(function(){
            if(Meteor.user()){
                $('ul.tabs').tabs('select_tab', 'firstTabPostCreation');
            }
        })
    }

    if(!!Meteor.user()){
        $('ul.tabs').tabs('select_tab', 'firstTabPostCreation');
    }
});

Template.CreateNewAccount.onDestroyed(function () {
    Session.set("accountCreationProgress", null);    
});

Template.CreateNewAccount.helpers(_.extend(Maestro.Locations.Helpers, {
    getUserInfo: function(){
        return Template.instance().infoObject.get().userInfo;
    },

    getBusinessInfo: function(){
        return Template.instance().infoObject.get().businessInfo;
    },

    getLocationInfo: function(){
        return Template.instance().infoObject.get().locationInfo;
    },    

    isUserCreated: function(){
        if(Session.get("accountCreationProgress")){
            return Session.get("accountCreationProgress").userCreated;
        }
    },

    isBusinessCreated: function(){
        if(Session.get("accountCreationProgress")){
            return Session.get("accountCreationProgress").businessCreated;
        }
    },

    isLocationCreated: function(){
        if(Session.get("accountCreationProgress")){
            return Session.get("accountCreationProgress").locationCreated;
        }
    },

    isAllCreated: function(){
        if(Session.get("accountCreationProgress")){
            return Session.get("accountCreationProgress").userCreated && Session.get("accountCreationProgress").businessCreated && Session.get("accountCreationProgress").locationCreated;
        }
    },

    isRedirectToWWW: function(){
        if(Template.instance().redirectSource == "www"){
            return true;
        }
        return false;
    }
}));

Template.CreateNewAccount.events(_.extend(Maestro.Locations.Events, {
    'blur #user-name': function(event, template) {
        event.preventDefault();

        let userName = template.find("#user-name").value;
        // console.log(userName);
        if(userName) {
            Maestro.Users.userExistsByUsername(userName, function (error, result) {
                if(result){
                    // console.log('username exists');
                    Maestro.Client.toggleValidationClass("#user-name", false);
                    Materialize.toast("Sorry, this username is taken.", 10000, 'rounded red');
                } else {
                    Maestro.Client.toggleValidationClass("#user-name", true);
                    // console.log('username does not exist');
                }
            });
        }
    },
    'blur #email': function(event, template) {
        event.preventDefault();

        let email = template.find("#email").value;
        // console.log(email);
        if(email) {
            Maestro.Users.userExistsByEmail(email, function (error, result) {
                if(result){
                    // console.log("email exists");
                    Maestro.Client.toggleValidationClass("#email", false);
                    Materialize.toast("Sorry, this email has already been used.", 10000, 'rounded red');
                } else {
                    Maestro.Client.toggleValidationClass("#email", true);
                    // console.log('email does not exist');
                }
            });
        }
    },
    'blur #confirm-password': function(event, template) {
        event.preventDefault();

        let password = template.find("#password").value,
            confirmPassword = template.find("#confirm-password").value;

        if(confirmPassword === password) {
            Maestro.Client.toggleValidationClass("#confirm-password", true);
        } else {
            Maestro.Client.toggleValidationClass("#confirm-password", false);
        }
    },

    'blur #business-name': function(event, template) {
        event.preventDefault();

        let businessName = template.find("#business-name").value;
        // console.log(businessName);
        if(businessName) {
            Maestro.Business.businessExistsByName(businessName, function (error, result) {
                if(result){
                    // console.log('username exists');
                    Maestro.Client.toggleValidationClass("#business-name", false);
                    Materialize.toast("This is strange...there seems to be an identical Business Name already in our system. Please revise name or contact us.", 10000, 'rounded red');
                } else {
                    Maestro.Client.toggleValidationClass("#business-name", true);
                    // console.log('username does not exist');
                }
            });
        }
    },

    'click #save-owner-info': function(event, template){
        event.preventDefault();

        let firstName = template.find("#first-name").value,
            lastName = template.find("#last-name").value,
            // businessName = template.find("#business-name").value,
            email = template.find("#email").value,
            username = template.find("#user-name").value,
            password = template.find("#password").value,
            confirmPassword = template.find("#confirm-password").value;

        if(!firstName){
            Materialize.toast("Please enter your first name", 3000, "rounded red");
            Maestro.Client.toggleValidationClass("#first-name", false);
            return; 
        }

        if(!lastName){
            Materialize.toast("Please enter your last name", 3000, "rounded red");
            Maestro.Client.toggleValidationClass("#last-name", false);
            return; 
        }
        
        if(!email){
            Materialize.toast("Please enter your email", 3000, "rounded red");
            Maestro.Client.toggleValidationClass("#email", false);
            return; 
        }

        if(!username){
            Materialize.toast("Please enter your username", 3000, "rounded red");
            Maestro.Client.toggleValidationClass("#user-name", false);
            return; 
        }

        if(!password){
            Materialize.toast("Please enter a password", 3000, "rounded red");
            Maestro.Client.toggleValidationClass("#password", false);
            return;
        }

        if(!confirmPassword){
            Materialize.toast("Please confirm your password", 3000, "rounded red");
            Maestro.Client.toggleValidationClass("#confirm-password", false);
            return;
        }

        if(!(confirmPassword === password)) {
            Materialize.toast("The passwords you entered do no match", 3000, "rounded red");
            template.find("#password").value = "";
            template.find("#confirm-password").value = "";
            Maestro.Client.toggleValidationClass("#password", false);
            Maestro.Client.toggleValidationClass("#confirm-password", false);
            return;
        }
        // console.log($('#create-owner').find('.invalid').length);
        if($('#create-owner').find('.invalid').length > 0){
            Materialize.toast("Please revise highlighted sections", 3000, "rounded red");
            return;
        }

        let userInfoObject = {
            username: username,
            password: password,
            email: email,
            firstName: firstName,
            lastName: lastName
        };

        template.infoObject.set({
            userInfo: userInfoObject
        });

        $('ul.tabs').tabs('select_tab', 'businessInfo');
    },

    'click #save-business-info': function(event, template){
        event.preventDefault();

        let businessName = template.find("#business-name").value;
        let businessPhone = template.find("#business-phone").value;
        let businessEmail = template.find("#business-email").value;

        if(!businessName){
            Materialize.toast("Please entere a business name", 3000, "rounded red");
            Maestro.Client.toggleValidationClass("#business-name", false);
            return;
        }        
        if(!businessEmail){
            Materialize.toast("Please entere a business email", 3000, "rounded red");
            Maestro.Client.toggleValidationClass("#business-name", false);
            return;
        }

        businessPhone = Number(parseInt(businessPhone.replace(/[^0-9]/g,'')));

        if(!businessPhone){
            Materialize.toast("Please entere a business phone", 3000, "rounded red");
            Maestro.Client.toggleValidationClass("#business-name", false);
            return;
        }

        let business = {
            name: businessName,
            email: businessEmail,
            phone: businessPhone,
        };

        let infoObject = template.infoObject.get();
        infoObject.businessInfo = business;
        template.infoObject.set(infoObject);

        // console.log(template.infoObject.get());
        $('ul.tabs').tabs('select_tab', 'firstLocationInfo');
    },
    
    'click #save-location-info': function(event, template){
        event.preventDefault();

        let locationName = template.find("#location-name").value,
            street = template.find("#address-street").value,
            city = template.find("#address-city").value,
            state = template.find("#address-state").value,
            pin = template.find("#address-pin").value,
            country = template.find("#address-country").value;

        // let businessId = Maestro.Business.getBusinessId();

        if(!locationName){
            Materialize.toast("Please enter a name for your first location", 3000, "rounded red");
            Maestro.Client.toggleValidationClass("#location-name", false);
            return;
        }

        if(!street){
            Materialize.toast("Please enter the location's street address", 3000, "rounded red");
            Maestro.Client.toggleValidationClass("#address-street", false);
            return;
        }

        if(!city){
            Materialize.toast("Please enter the location's city", 3000, "rounded red");
            Maestro.Client.toggleValidationClass("#address-city", false);
            return;
        }

        if(!state){
            Materialize.toast("Please enter the location's province", 3000, "rounded red");
            Maestro.Client.toggleValidationClass("#location-state", false);
            return;
        }

        function checkPostal(postal) {
            var regex = new RegExp(/^\w{6}|\w{3}\s{1}\w{3}$/);
            // console.log(regex.test(postal.value));
            if (regex.test(postal.value)) {
                return true;
            } 

            return false;
        }

        if(!pin){
            Materialize.toast("Please enter the location's postal code", 3000, "rounded red");
            Maestro.Client.toggleValidationClass("#location-pin", false);
            return;
        } else if (!checkPostal(pin)){
            Materialize.toast("Please enter a valid postal code", 3000, "rounded red");
            Maestro.Client.toggleValidationClass("#location-pin", false);
            return;
        }

        if(!country){
            Materialize.toast("Please enter the country", 3000, "rounded red");
            Maestro.Client.toggleValidationClass("#location-country", false);
            return;
        }

        let locationDetails = {
            name: locationName,
            // businessId: businessId,
            address: {
                street: street,
                city: city,
                state: state,
                pin: pin,
                country: country
            }
        };

        let infoObject = template.infoObject.get();
        infoObject.locationInfo = locationDetails;
        template.infoObject.set(infoObject);

        // console.log(template.infoObject.get());

        $('ul.tabs').tabs('select_tab', 'summaryOfInfo');
    },

    'click #startup-account': function(event, template){
        let userInfo = template.infoObject.get().userInfo;

        let username = userInfo.username, 
            password = userInfo.password, 
            email = userInfo.email, 
            firstName = userInfo.firstName, 
            lastName = userInfo.lastName;

        let infoObject = new ReactiveVar();
        infoObject.set(template.infoObject.get());

        let businessDetails = new ReactiveVar();
        let businessInfo = template.infoObject.get().businessInfo;

        if(Meteor.isCordova){        
            let localAppId = UserSession.get(Maestro.UserSessionConstants.LOCAL_APP_ID);
            let currentAppObj = {appId: localAppId, deviceInfo: device, posEnabled: true};
            businessInfo.devices = [currentAppObj];
        }

        businessInfo.configuration = {
            adminPin: "abcd1234",
            autoEnrollNewDevices: true,
        };

        businessDetails.set(businessInfo);

        let locationDetails = new ReactiveVar();
        locationDetails.set(template.infoObject.get().locationInfo);

        let userCreated = new ReactiveVar();
        let businessCreated = new ReactiveVar();
        let locationCreated = new ReactiveVar();

        $('ul.tabs').tabs('select_tab', 'progressTab');

        Maestro.Users.createUser({username, password, email, firstName, lastName}, function(error) {
            if(!error) {    
                // Materialize.toast("Meteor User account successfully created", 4000, "rounded green");
                
                Meteor.loginWithPassword(username, password, function(error) {
                    if (error){
                        console.log('login error: ', error);
                    } else {
                       
                        Meteor.call("createBusinessAdminUser", function (error, result) {
                            if (error) {
                                console.log(error);
                            } else {
                                // Materialize.toast("Business user account successfully created.", 4000, "rounded green");
                                let progressObject = Session.get("accountCreationProgress");
                                progressObject.userCreated = true;
                                Session.set("accountCreationProgress", progressObject);

                                // console.log('business user created: ', result);
                                // console.log(businessDetails.get());
                                
                                Meteor.call("createBusinessAccount", businessDetails.get(), function (error, result) {
                                    if (error) {
                                        console.log(error);
                                    } else {
                                        // Materialize.toast("Business successfully created.", 4000, "rounded green");
                                        let progressObject = Session.get("accountCreationProgress");
                                        progressObject.businessCreated = true;
                                        Session.set("accountCreationProgress", progressObject);
                                        // console.log('business created: ', result);
                                        let {businessId} = result;
                                        // console.log("business id and result", businessId, result);
                                        
                                        Meteor.call("selectBusinessSession", businessId, function(error){
                                            if (error){
                                                console.log(error);
                                            } else {
                                                // Maestro.Client.selectBusiness(Businesses.findOne({_id: businessId}));
                                                Maestro.Client.selectBusinessId(businessId);
                                                Maestro.Client.selectBusinessName(businessDetails.get().name);
                                            }
                                        });
                                        
                                        let location = locationDetails.get();
                                        location.businessId = businessId;
                                        // console.log("location: ", location);

                                        Meteor.call("addBusinessLocation", location, function(error, result) {
                                            if(error) {
                                                console.log(error);
                                            } else {
                                                // Materialize.toast("Added location", 4000);
                                                let progressObject = Session.get("accountCreationProgress");
                                                progressObject.locationCreated = true;
                                                Session.set("accountCreationProgress", progressObject);
                                            }
                                        });

                                        Maestro.Business.Notifications.NewAccountCreated(infoObject.get());
                                    }
                                });
                            }
                        });
                    }
                });
            } else {
                console.log(error);
            }
        });
        // console.log("progress: ", Session.get("accountCreationProgress"));

    },

    'click .goBackToPrevious': function(event, template){
        window.history.back();
    },

    'click .goToUserInfo': function(event, template){
        $('ul.tabs').tabs('select_tab', 'userInfo');
    },

    'click .goToBusinessInfo': function(event, template){
        $('ul.tabs').tabs('select_tab', 'businessInfo');
    },

    'click .goToLocationInfo': function(event, template){
        $('ul.tabs').tabs('select_tab', 'firstLocationInfo');
    },


}));