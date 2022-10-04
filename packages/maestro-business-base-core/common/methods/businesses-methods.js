let _findBusinessByName = function (businessName) {
    return Businesses.find({name: businessName});
};

let _businessExists = function (businessName) {
    var businesses = _findBusinessByName(businessName);
    return businesses.count();
};

validateUsersBusiness = function (userId, businessId) {
    return !_.isEmpty(Meteor.users.findOne({_id: userId, "profile.businessId": businessId}));
};

let _createBusiness = function (businessDetails, userId) {
    //businessDetails.createdBy = userId;
    /*businessDetails.configuration = {
        sizes: Maestro.Products.Sizes
    };*/

    check(businessDetails, Maestro.Schemas.Business);

    if (Meteor.call("businessExists", businessDetails.name)) {
        throw Meteor.Error(405, `Business with name [${businessDetails.name}] already exists`);
    }

    return Businesses.insert(businessDetails, {extendAutoValueContext: {userId: userId}});
};

let _createUser = function (userDetails) {


    check(userDetails.profile, Maestro.Schemas.UserProfile);

    if (Meteor.call("userExists", userDetails.username)) {
        throw Meteor.Error(405, `User with username [${userDetails.username}] already exists`);
    }

    //TODO enforce SHA256 passwords from client
    return Accounts.createUser(userDetails);
};

let _createBusinessUser = function (userId, businessId, role) {
    var businessUser = {
        userId: userId,
        businessId: businessId,
        status: Maestro.User.Status.ACTIVE.key,
        role: role
    };

    var businessUserId = BusinessUsers.insert(businessUser, {extendAutoValueContext: {userId: userId}});

    //TODO remove this feature, move to business.user
    // update user details for business and role
    //Meteor.users.update({_id: userId}, {$set: {"profile.businessId": businessId}}, {extendAutoValueContext: {userId: userId}});

    return businessUserId;
};

Meteor.methods({
    businessExists: function (businessName) {
        if (!this.isSimulation) {
            return _businessExists(businessName);
        }
    },

    createBusinessAccount: function(businessDetails) {
        // if (Meteor.call("businessExists", businessDetails.name)) {
        //     throw Meteor.Error(405, `Business with name [${businessDetails.name}] already exists`);
        // }

        try {
            let businessId = Businesses.insert(businessDetails);
            console.log(Businesses.findOne({_id: businessId}));

            // let businessUser = {
            //     userId: this.userId,
            //     businessId: businessId,
            //     status: Maestro.User.Status.ACTIVE.key,
            //     role: Maestro.Business.Roles.BUSINESS_ADMIN
            // };

            let businessUserId = Meteor.user().profile.businessUserId;
            let userDetails = BusinessUsers.findOne({_id:businessUserId});
            let addBusinessDetails = {businessId: businessId, businessName: businessDetails.name};

            if( userDetails){
                if( userDetails.businessesList ){
                    if(userDetails.businessesList.length == 0){
                        userDetails.businessesList = [addBusinessDetails];
                    } else {
                        userDetails.businessesList.push(addBusinessDetails);
                    }
                } else {
                    userDetails.businessesList = [addBusinessDetails];
                }
            } else {console.log('error getting user details');}

            BusinessUsers.update(businessUserId, {$set: {businessesList: userDetails.businessesList}});
            console.log(BusinessUsers.findOne({_id:businessUserId }));
            //TODO remove this feature, move to business.user
            // update user details for business and role
            // Meteor.users.update({_id: this.userId}, {$set: {"profile.businessId": businessId}});
            // Roles.addUsersToRoles(this.userId, Maestro.Business.Roles.BUSINESS_ADMIN);

            //run on create business hooks
            Maestro.Business.runBusinessCreationHooks(businessId, this.userId);

            return {businessId};
        } catch (e) {
            console.log("ERROR CREATING BUSINESS: ", e);
            throw e;
        }
    },

    createBusinessAdminUser: function() {
        try {
            let businessUser = {
                userId: this.userId,
                status: Maestro.User.Status.ACTIVE.key,
                role: Maestro.Business.Roles.BUSINESS_ADMIN
            };

            let businessUserId = BusinessUsers.insert(businessUser);

            //TODO remove this feature, move to business.user
            // update user details for business and role
            // Meteor.users.update({_id: this.userId}, {$set: {"profile.businessId": businessId}});
            Roles.addUsersToRoles(this.userId, Maestro.Business.Roles.BUSINESS_ADMIN);
            Meteor.users.update({_id: this.userId}, {$set: {"profile.businessUserId": businessUserId}});

            //run on create business hooks
            // Maestro.Business.runBusinessCreationHooks(businessId, this.userId);

            return {businessUserId};
        } catch (e) {
            console.log("ERROR CREATING BUSINESS USER: ", e);
            throw e;
        }
    },

    selectBusinessSession: function(businessId){
        try {
            let userDetails = Meteor.users.findOne({_id: this.userId});
            
            // Meteor.users.update({_id: this.userId}, {$set: {"profile.businessId": businessId}});
            if (userDetails.profile.businessUserId){
                let updates = BusinessUsers.update({_id: userDetails.profile.businessUserId}, {$set: {businessId: businessId}});
                console.log(updates);
            } else {
                let updates = BusinessUsers.update({userId: this.userId}, {$set: {businessId: businessId}});
                console.log(updates);
                userDetails.profile.businessUserId = BusinessUsers.findOne({_id: this.userId});
            }

            userDetails.profile.businessId = businessId;
            Meteor.users.update({_id: this.userId}, {$set: {profile: userDetails.profile}});

        } catch (e) {
            throw e;
        }
    },

    // createBusiness: function (businessDetails, ownerDetails) {
    //     let userId;
    //     let businessId;

    //     try {
    //         //create user
    //         let {username, password, email, profile: {firstName, lastName}} = ownerDetails;
    //         userId = Users.createUser(username, password, email, firstName, lastName);

    //         //this.setUserId(userId);

    //         //create business (also adds current user as business admin user)
    //         businessId = _createBusiness(businessDetails, userId);

    //         //run on create business hooks
    //         Business.runBusinessCreationHooks(businessId, userId);

    //     } catch (e) {
    //         console.log("Error creating business: ", e);

    //         if (businessId) {
    //             Businesses.remove({_id: businessId});
    //             businessId = undefined;
    //         }

    //         if (userId) {
    //             Meteor.users.remove({_id: userId});
    //             userId = undefined;
    //         }

    //         throw e;
    //     }

    //     return {
    //         businessId: businessId,
    //         userId: userId
    //     };
    // },

    updateBusinessProductSizes: function (businessId, sizesList) {
        // console.log(sizesList);
        // check(sizesList, [Maestro.Schemas.BusinessProductSize]);
        if (validateUsersBusiness(this.userId, businessId)) {
            Businesses.update(businessId, {$set: {"configuration.sizes": sizesList}});
            return "Update successful";
        } else {
            throw Error("User does not have permissions to update", "access_denied");
        }
    },

    setBusinessAttr: function (businessId, businessAttrMod) {
        var updates;
        
        try {
            updates = Businesses.update(businessId, {$set: businessAttrMod});
            console.log("Records updated: ", updates);
        } catch (e) {
            console.log("Error updating business: ", e);
        }
    },

    addNewDevice: function (businessId, currentAppObj){
        let updates;

        let thisBusiness = Businesses.findOne({_id: businessId});
        if(!!thisBusiness){
            if(!!thisBusiness.configuration){
                if(thisBusiness.configuration.autoEnrollNewDevices == true){
                    currentAppObj.posEnabled = true;
                }
            }
        }

        let registeredDeviceList = thisBusiness.devices || [];
        registeredDeviceList.push(currentAppObj);
        let businessAttrMod = {devices: registeredDeviceList};

        updates = Businesses.update(businessId, {$set: businessAttrMod});
    },

    addBusinessAttr: function (businessId, businessAttrMod) {
        var updates;
        try {
            updates = Businesses.update(businessId, {$addToSet: businessAttrMod});
            console.log("Records updated: ", updates);
        } catch (e) {
            console.log("Error updating business: ", e);
        }
    },


});
