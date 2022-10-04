LoyaltyCards = new Mongo.Collection("loyalty-cards");

Maestro.Schemas.LoyaltyCard = new SimpleSchema({
    businessId:{
        type: String
    },
    customerId: {
        type: String
    },
    programId: {
        type: String
    },
    programType: { //Quantity, Percentage, Amount, Tally
        type: String
    },
    remainingQuantity: { //for quantity based cards
        type: Number,
        defaultValue: 0,
        optional: true,
    },
    remainingAmount: { //for money based cards
        type: Number,
        decimal: true,
        defaultValue: 0,
        optional: true,
    },
    creditPercent: { //for percentage off, storead as decimal number
        type: Number,
        defaultValue: 0,
        optional: true,
    },
    tally: { //for quantity based cards
        type: Number,
        defaultValue: 0,
        optional: true,
    },
    boughtOn: {
        type: Date,
        optional: true,
    },
    expired: {// true for expired, false for not-expired
        type: Boolean,
        defaultValue: false,
        optional: true,
    },
    updatedOn: {
        type: Date,
        optional: true,
    }
});

LoyaltyCards.attachSchema(Maestro.Schemas.LoyaltyCard);

LoyaltyCards.allow({ 
    insert() { return true; }, 
    update() { return true; }, 
    remove() { return true; } 
}); 

LoyaltyCards.deny({ 
    insert() { return false; }, 
    update() { return false; }, 
    remove() { return false; } 
});
