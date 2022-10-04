Maestro.Schemas.BusinessUserPersona = new SimpleSchema({
    locationId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id
    },
    role: {
        type: String,// role name
        allowedValues: _.values(Maestro.Business.Roles),
        optional: true
    }
});

Maestro.Schemas.BusinessDetail = new SimpleSchema({
    businessId: {
        type: String
    },
    businessName: {
        type: String
    }
});

Maestro.Schemas.BusinessUser = new SimpleSchema({
    userId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        index: true,
        denyUpdate: true
    },
    businessId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        index: true,
        optional: true
        // denyUpdate: true
    },
    role: {
        type: String, // role name
        allowedValues: _.values(Maestro.Business.Roles),
        optional: true
    },
    status: {
        type: String,
        defaultValue: Maestro.User.Status.ACTIVE.key,
        allowedValues: Maestro.User.Status.keys()
    },
    persona: {
        type: [Maestro.Schemas.BusinessUserPersona],
        optional: true,
        defaultValue: null
    },
    businessesList: {
        type: [Maestro.Schemas.BusinessDetail],
        optional: true
    }
});

