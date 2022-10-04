Meteor.publish("user-businesses", function() {
    return BusinessUsers.find({userId: this.userId}, {fields: {userId : 1, businessId: 1, businessesList: 1}});
});

Meteor.publish("business-core-information", function(businessId) {
    // const businessUser = BusinessUsers.findOne({userId: this.userId, businessId: businessId, status: "A"});
    const businessUser = BusinessUsers.findOne({userId: this.userId});

    if(businessUser) {
        if(businessUser.isBusinessAdmin()) {
            return [
                Businesses.find({ _id: businessId } ),
                Locations.find({ businessId: businessId }),
                // BusinessUsers.find({ businessId: businessId }),
                // Meteor.users.find({ _id: { $in : _.pluck(BusinessUsers.find({ businessId: businessId }, {fields: {userId: 1}}).fetch(), "userId") } })
                Meteor.users.find({'profile.businessId': businessId})
            ];
        } else {
            return [
                Businesses.find({ _id: businessId }),
                Locations.find({ businessId: businessId }),
                // BusinessUsers.find({ businessId: businessId, userId: this.userId }),
                Meteor.users.find({ _id: this.userId })
            ];
        }
    } else { // temporary measure for old accounts
        return [
            Businesses.find({ _id: businessId } ),
            Locations.find({ businessId: businessId }),
            // BusinessUsers.find({ businessId: businessId }),
            // Meteor.users.find({ _id: { $in : _.pluck(BusinessUsers.find({ businessId: businessId }, {fields: {userId: 1}}).fetch(), "userId") } })
            Meteor.users.find({'profile.businessId': businessId})
        ];
    }

    return [];
});
