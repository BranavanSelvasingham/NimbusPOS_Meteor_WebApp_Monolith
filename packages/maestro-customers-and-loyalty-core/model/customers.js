Customers = new Mongo.Collection("customers");

Maestro.Schemas.CustomerLoyaltyProgram = new SimpleSchema({
    programId: {
        type: String
    },
    remainingQuantity: { //for quantity based cards
        type: Number,
        defaultValue: 0
    },
    remainingAmount: { //for money based cards
        type: Number,
        decimal: true,
        defaultValue: 0
    },
    creditPercent: { //for percentage off, storead as decimal number
        type: Number,
        defaultValue: 0
    },
    boughtOn: {
        type: Date
    },
    expired: {// true for expired, false for not-expired
        type: Boolean,
        defaultValue: false
    },
    // history: {
    //     type: [Object],
    //     optional: true,
    //     autoValue: function() {
    //         let bought = this.field("boughtOn");
    //         if (bought.isSet) {
    //             historyObj = {
    //                 date: new Date,
    //                 bought: bought.value
    //             };
    //             if (this.isInsert) {
    //                 return [historyObj];
    //             } else {
    //                 return {
    //                     $push: historyObj
    //                 };
    //             }
    //         } else {
    //             this.unset();
    //         }
    //     }
    // }
});

Maestro.Schemas.CustomerTallyProgram = new SimpleSchema({
    programId: {
        type: String
    },
    tally: { //for quantity based cards
        type: Number,
        defaultValue: 0
    }
});

Maestro.Schemas.Customer = new SimpleSchema({
    name: {
        type: String,
        index: true
    },
    email: {
        type: String,
        optional: true
    },
    phone: {
        type: Number,
        optional: true
    },
    businessId: {
        type: String
    },
    userId: {
        type: String,
        optional: true
    },
    notes: {
        type: String,
        optional: true,
    },
    loyaltyPrograms: {
        type: [Maestro.Schemas.CustomerLoyaltyProgram],
        optional: true,
    },
    tallyPrograms: {
        type: [Maestro.Schemas.CustomerTallyProgram],
        optional: true
    }
});

Customers.attachSchema(Maestro.Schemas.Customer);

Customers.allow({ 
    insert() { return true; }, 
    update() { return true; }, 
    remove() { return true; } 
}); 

Customers.deny({ 
    insert() { return false; }, 
    update() { return false; }, 
    remove() { return false; } 
});