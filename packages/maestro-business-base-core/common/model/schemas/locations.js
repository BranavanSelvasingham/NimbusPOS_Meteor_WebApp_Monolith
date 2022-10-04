Maestro.Schemas.Printer = new SimpleSchema({
    connection: {
        type: String
    },
    use: {
        type: String,
        optional: true
    },
    address: {
        type: String
    },
    name: {
        type: String
    },
    disabled: {
        type: Boolean,
        optional: true
    }
});

Maestro.Schemas.FloorTile = new SimpleSchema({
    name: {
        type: String,
        optional: true
    },
    url: {
        type: String,
        optional: true
    }
});

Maestro.Schemas.CornerCoordinates = new SimpleSchema({
    x: {
        type: Number,
        decimal: true,
        optional: true,
    },
    y: {
        type: Number,
        decimal: true,
        optional: true,
    },
    z: {
        type: Number,
        decimal: true,
        optional: true,
    }
});

Maestro.Schemas.FloorSections = new SimpleSchema({
    name: {
        type: String,
        optional: true
    },
    floorTile: {
        type: Maestro.Schemas.FloorTile,
        optional: true
    },
    vertices:{
        type: [Maestro.Schemas.CornerCoordinates],
        optional: true
    }
});

Maestro.Schemas.Location = new SimpleSchema({
    name: {
        type: String
    },
    businessId: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        denyUpdate: true,
        index: true
    },
    address: {
        type: Maestro.Schemas.AddressSchema,
        optional: true
    },
    receiptMessage: {
        type: String,
        optional: true
    },
    printers: {
        type: [Maestro.Schemas.Printer],
        optional: true
    },
    floorLayoutSections:{
        type: [Maestro.Schemas.FloorSections],
        optional: true
    }
});
