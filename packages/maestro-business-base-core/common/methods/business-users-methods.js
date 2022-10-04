let _findBusinessUsers = function (query, sort) {
    var options = {
        transform: function (user) {
            let businessUser = BusinessUsers.findOne({userId: user._id});

            user.businessId = businessUser && businessUser.businessId || null;
            user.status = businessUser && businessUser.status || null;
            user.role = businessUser && businessUser.role || null;
            user.persona = businessUser && businessUser.persona || [];

            user.isBusinessAdmin = function() {
                return this.role === Maestro.Business.Roles.BUSINESS_ADMIN;
            };

            return user;
        }
    };

    if (sort) {
        options.sort = sort;
    }

    return Meteor.users.find(query, options);
};

Meteor.methods({
    "find.user.businesses": function(userId) {
        let businessesList = null;

        if(!this.isSimulation) {
            businessUsers = BusinessUsers.find({userId, status: "A"}).fetch();

            let businessIds = _.pluck(businessUsers, "businessId");
            businessesList = Businesses.find(
                { _id: { $in: businessIds} },
                { fields: { name: 1} }
            ).fetch();
        }

        return businessesList;
    },

    "business.users.remove": function (businessUserId) {
        const businessId = Maestro.Business.getBusinessId(this);

        if(!businessId) {
            throw new Meteor.Error("business.users.remove:no-business-selected", "A business must be selected to proceed!");
        }

        const currentBusinessUser = BusinessUsers.findOne({
            userId: this.userId,
            businessId: businessId
        });


        const userToRemove = BusinessUsers.findOne({
            _id: businessUserId,
            businessId: businessId
        });

        if(!userToRemove) {
            throw new Meteor.Error("business.users.remove:no-business-user-selected", "A business user must be selected to proceed!");
        }

        //allow removal by a business admin only
        if(!currentBusinessUser.isBusinessAdmin()) {
            throw new Meteor.Error("business.users.remove:not-authorized", "Only a business administrator can remove a business user!");
        }

        //allow removal only when there are other business users
        if(currentBusinessUser.isBusinessAdmin()) {
            const additionalAdmins = BusinessUsers.find({
                businessId: businessUser.businessId,
                role: Maestro.Business.Roles.BUSINESS_ADMIN,
                userId: { $nin: [ businessUser.userId ]}
            }).count();

            if(additionalAdmins) {
                throw new Meteor.Error("business.users.remove:cannot-remove-only-admin", "Cannot remove the only business admin!");
            }
        }

        BusinessUsers.remove(businessUserId);
    },

    findBusinessUsers: function (query, sort) {
        return _findBusinessUsers(query, sort);
    },

    createBusinessUser: function (user, role = Maestro.Business.Roles.BUSINESS_USER) {
        var userId;

        try {
            //create user
            let {username, password, email, profile: {firstName, lastName}} = user;

            console.log('at create business user: ', {username, password, email, profile: {firstName, lastName}});

            let businessId = user.profile.businessId;
            
            // let businessId = this.isSimulation ? UserSession.get(Maestro.UserSessionConstants.BUSINESS_ID) : UserSession.get(Maestro.UserSessionConstants.BUSINESS_ID, this.userId, this.connection.id);

            // console.log("connection : " ,  this.userId, " >> ", this.connection.id);
            // console.log("connection : " ,  this.userId, " >> ", Meteor.connection);

            // console.log("Business ID:: ", businessId, " >> ",  this.isSimulation);
            // if(!businessId) {
            //     businessId = user.profile.businessId;
            // }

            let userId = Maestro.Users.createUser({username, password, email, firstName, lastName, businessId});
            console.log("created new user with Id: ", userId);

            //create business user
            if(userId){
                let businessUserId = BusinessUsers.insert({
                                            userId: userId,
                                            businessId: businessId,
                                            role: role,
                                            status: Maestro.User.Status.ACTIVE.key
                                        });
            }

        } catch (e) {
            console.log("Error creating user: ", e);

            if (userId) {
                Meteor.users.remove({_id: userId});
                userId = undefined;
            }

            return e;
        }

        return {
            userId: userId
        };
    },

    changeBusinessUserPassword: function (userId, password) {
        check(userId, String);
        check(password, String);

        var currentUserCursor = _findBusinessUsers({_id: this.userId});
        var userCursor = _findBusinessUsers({_id: userId});

        var currentUser = currentUserCursor && currentUserCursor.fetch() && currentUserCursor.fetch()[0];
        var user = userCursor && userCursor.fetch() && userCursor.fetch()[0];

        if (currentUser
            && currentUser.isBusinessAdmin()
            && currentUser.businessId === user.businessId) {

            Accounts.setPassword(userId, password);
        } else {
            throw new Meteor.Error("not-authorized", "User not authorized!");
        }

        return {
            success: true
        };
    }
});