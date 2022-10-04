Maestro.Business.getBusinessId = function (context) {
    if(context) {
        return UserSession.get(Maestro.UserSessionConstants.BUSINESS_ID, context.userId, context.connection.id);
    }

    return null;
};

Maestro.Business.getBusiness = function (context) {
    if(context) {
        return Businesses.findOne( { _id: UserSession.get(Maestro.UserSessionConstants.BUSINESS_ID, context.userId, context.connection.id) } );
    }

    return null;
};

Maestro.Business.getLocationId = function (context) {
    if(context) {
        return UserSession.get(Maestro.UserSessionConstants.LOCATION_ID, context.userId, context.connection.id);
    }

    return null;
};

Maestro.Business.getLocationName = function (context) {
    if(context) {
        return UserSession.get(Maestro.UserSessionConstants.LOCATION_NAME, context.userId, context.connection.id);
    }

    return null;
};