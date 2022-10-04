Businesses = new Maestro.Collection("businesses", Maestro.Schemas.Business);
Locations = new Maestro.Collection("locations", Maestro.Schemas.Location);

Locations.allow({ 
    insert() { return true; }, 
    update() { return true; }, 
    // remove() { return true; } 
}); 

Locations.deny({ 
    insert() { return false; }, 
    update() { return false; }, 
    // remove() { return false; } 
});

BusinessUsers = new Maestro.Collection("business-users", Maestro.Schemas.BusinessUser, [],
    { //mongo Options
        transform: function(businessUser) {
            return new class BusinessUser {
                constructor(businessUserRecord) {
                    _.extend(this, businessUserRecord);
                }

                isBusinessAdmin() {
                    return this.role === Maestro.Business.Roles.BUSINESS_ADMIN;
                }
            }(businessUser);
        }
    }
);

if(Meteor.isServer) {
    //unique index for business users
    BusinessUsers._ensureIndex({userId: 1, businessId: 1}, {unique: 1});

    //todo may not be needed at all.. consider removing
    /*Businesses.after.insert(function (userId, business) {
        BusinessUsers.insert({
            userId: userId,
            businessId: business._id,
            status: Maestro.User.Status.ACTIVE.key,
            role: Maestro.Business.Roles.BUSINESS_ADMIN
        });
    });*/

    Businesses.before.remove(function (userId, business) {
        BusinessUsers.direct.remove({
            businessId: business._id
        });
    });
}