Maestro.Business.getBusinessId = function () {
    if(Meteor.user()){
        return UserSession.get(Maestro.UserSessionConstants.BUSINESS_ID) || Meteor.user().profile.businessId;
    } else {
        return UserSession.get(Maestro.UserSessionConstants.BUSINESS_ID) 
    }
    //return Meteor.user().profile.businessId;
};

Maestro.Business.getBusinessName = function () {
    let business = Businesses.findOne({ _id: Maestro.Business.getBusinessId() });
    if(!!business){
        return business.name;
    } else {
        return UserSession.get(Maestro.UserSessionConstants.BUSINESS_NAME);
    }
    
    //return Meteor.user().profile.businessId;
};

Maestro.Business.getBusiness = function () {
	let businessId = Maestro.Business.getBusinessId();
	if(!businessId){
		businessId = Meteor.user().profile.businessId;
	}
    return Businesses.findOne({ _id: Maestro.Business.getBusinessId() });
    //return Businesses.findOne({_id: Meteor.user().profile.businessId});
};

Maestro.Business.getLocationId = function () {
    return UserSession.get(Maestro.UserSessionConstants.LOCATION_ID);
};

Maestro.Business.getLocationName = function () {
    return UserSession.get(Maestro.UserSessionConstants.LOCATION_NAME);
};

Maestro.Business.getAllLocationNames = function () {
    return _.pluck(Locations.find({}).fetch(), "name");
};

Maestro.Business.getAllLocations = function () {
    return Locations.find({}).fetch();
};

Maestro.Business.getLocation = function(){
	return Locations.findOne({_id: Maestro.Business.getLocationId()});
};

Maestro.Business.getConfigurations = function(){
    return (Maestro.Business.getBusiness() || {}).configuration || {};
};