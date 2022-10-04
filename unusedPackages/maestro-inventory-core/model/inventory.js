Inventory = new Mongo.Collection("inventory");

Maestro.Schemas.InventoryBatch = new SimpleSchema({
    locationId: {
        type: String,
    },
    description: {
        type: String,
        optional: true
    },
    units: {
        type: Number,
        decimal: true
    },    
    createdDate: {
        type: Date,
        optional: true
    },
    expiryDate: {
        type: Date,
        optional: true
    },
    // expiryDays: {
    //     type: Date,
    //     optional: true
    // },
    cost: {
        type: Number,
        decimal: true,
        optional: true
    },
    status: {
        type: String, //active, expired,
        optional: true
    }
});

Maestro.Schemas.InventoryInProduct = new SimpleSchema({
    productId: {
        type: String
    },
    unitQuantityUsed: {
        type: Number,
        decimal: true,
    },
});

Maestro.Schemas.Inventory = new SimpleSchema({
    businessId: {
        type: String
    },
    name: {
        type: String
    },
    unitsOfMeasure: {
        type: String
    },
    batches: {
        type: [Maestro.Schemas.InventoryBatch],
        optional: true
    },
    products: {
        type: [Maestro.Schemas.InventoryInProduct],
        optional: true
    },
});

Inventory.attachSchema(Maestro.Schemas.Inventory);

Inventory.allow({ 
    insert() { return true; }, 
    update() { return true; }, 
    remove() { return true; } 
}); 

Inventory.deny({ 
    insert() { return false; }, 
    update() { return false; }, 
    remove() { return false; } 
});