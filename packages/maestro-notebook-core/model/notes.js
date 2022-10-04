Notes = new Mongo.Collection("notes");

Maestro.Schemas.NoteVisibility = new SimpleSchema({
    businessWide: {
        type: Boolean,
        defaultValue: true
    },
    locationSpecific: {
        type: Boolean,
        defaultValue: false
    },
    userSpecific: {
        type: Boolean,
        defaultValue: false
    },
    customerSpecific: {
        type: Boolean,
        defaultValue: false
    },
    orderSpecific: {
        type: Boolean,
        defaultValue: false
    }
});

Maestro.Schemas.Note = new SimpleSchema({
    businessId: {
        type: String
    },
    locationId: {
        type: String,
        optional: true
    },
    userId: {
        type: String,
        optional: true
    },
    customerId: {
        type: String,
        optional: true
    },
    orderId: {
        type: String,
        optional: true
    },
    title: {
        type: String,
        optional: true
    },
    description: {
        type: String,
        optional: true
    },
    visibleTo: {
        type: Maestro.Schemas.NoteVisibility
    },
    createdOn: {
        type: Date
    },
    createdBy: {
        type: String
    }
});

Notes.attachSchema(Maestro.Schemas.Note);

Notes.allow({ 
    insert() { return true; }, 
    update() { return true; }, 
    remove() { return true; } 
}); 

Notes.deny({ 
    insert() { return false; }, 
    update() { return false; }, 
    remove() { return false; } 
});