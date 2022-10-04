Orders = new Mongo.Collection("orders");

Maestro.Schemas.OrderProduct = new SimpleSchema({
    _id: {
        type: String
    },
    name: {
        type: String
    },
    sizes: {
        type: [Maestro.Schemas.ProductSize],
        minCount: 1
    }
});

Maestro.Schemas.OrderItemAddOns = new SimpleSchema({
    _id: {
        type: String
    },
    name: {
        type: String 
    },
    price: {
        type: Number,
        decimal: true,
        defaultValue: 0.00
    },
});

Maestro.Schemas.OrderItem = new SimpleSchema({
    itemNumber: {
        type: Number,
        decimal: true,
        optional: true
    },
    product: {
        type: Maestro.Schemas.OrderProduct
    },
    seatNumber:{
        type: Number,
        optional: true 
    },
    sentToKitchen: {
        type: Boolean,
        optional: true
    },
    isRedeemItem: {
        type: Boolean,
        optional: true
    },
    isManualRedeem: {
        type: Boolean,
        optional: true
    },
    variablePrice: {
        type: Boolean,
        optional: true,
    },
    unitBasedPrice: {
        type: Boolean,
        optional: true,
    },
    unitBasedPriceQuantity: {
        type: Number,
        decimal: true,
        optional: true,
    },
    unitPrice: {
        type: Number,
        decimal: true,
        optional: true,
    },
    unitLabel: {
        type: String,
        optional: true
    },
    notes: {
        type: [String],
        optional: true
    },
    size: {
        type: Maestro.Schemas.ProductSize
    },
    addOns: {
        type: [Maestro.Schemas.OrderItemAddOns],
        optional: true,
        defaultValue: null
    },
    quantity: {
        type: Number
    },
    redeemed: {
        type: Number,
        optional: true,
        defaultValue: null
    },
    total: {
        type: Number,
        decimal: true
    }
});

Maestro.Schemas.TaxComponents = new SimpleSchema({
    gst: {
        type: Number,
        decimal: true,
        optional: true,
        defaultValue: 0.00
    },

    pst: {
        type: Number,
        decimal: true,
        optional: true,
        defaultValue: 0.00
    },

    hst: {
        type: Number,
        decimal: true,
        optional: true,
        defaultValue: 0.00
    },
});

Maestro.Schemas.OrderPriceSchema = new SimpleSchema({
    subtotal: {
        type: Number,
        decimal: true,
        optional: true,
        defaultValue: 0.00
    },
    discount: {
        type: Number,
        decimal: true,
        optional: true,
        defaultValue: 0.00
    },
    adjustments: {
        type: Number,
        decimal: true,
        optional: true,
        defaultValue: 0.00
    },
    tax: {
        type: Number,
        decimal: true,
        optional: true,
        defaultValue: 0.00
    },
    taxComponents: {
        type: Maestro.Schemas.TaxComponents,
        optional: true
    },
    total: {
        type: Number,
        decimal: true
    }
});

Maestro.Schemas.GiftCard = new SimpleSchema({
    cardId: {
        type: String,
        optional: true
    },
    programId: {
        type: String //must be id of the Loyalty Program
    },
    redeemedAmount: {
        type: Number,
        decimal: true
    }
});

Maestro.Schemas.LoyaltyCard = new SimpleSchema({
    cardId: {
        type: String,
        optional: true
    },
    programId: {
        type: String //id of loyalty program
    },
    redeemedQuantity: {
        type: Number    //qty used in transaction
    }
});

Maestro.Schemas.PaymentInformation = new SimpleSchema({
    method: {
        type: String,
        allowedValues: Maestro.Payment.MethodsEnum.keys()
    },
    amount: {
        type: Number,
        decimal: true
    },
    giftCardTotal: {
        type: Number,
        decimal: true,
        optional: true,
        defaultValue: null
    },
    giftCards: {
        type: [Maestro.Schemas.GiftCard],
        optional: true,
        defaultValue: null
    },
    quantityCards:{
        type: [Maestro.Schemas.LoyaltyCard],
        optional: true,
        defaultValue: null
    },
    rounding: {
        type: Number,
        decimal: true,
        optional: true,
        defaultValue: null
    },
    received: {
        type: Number,
        decimal: true
    },
    cashGiven: {
        type: Number,
        decimal: true,
        optional: true
    },
    change: {
        type: Number,
        decimal: true,
        optional: true,
        defaultValue: null
    },
    tips: {
        type: Number,
        decimal: true,
        optional: true,
    }
});

Maestro.Schemas.TimeComponents = new SimpleSchema({
    year: {
        type: Number,
    },
    month: {
        type: Number,
    },
    day: {
        type: Number,
    },
    hour: {
        type: Number,
    }
});

Maestro.Schemas.OrderInformation = new SimpleSchema({
    orderType: {
        type: String,
        optional: true
    },
    orderName: {
        type: String,
        optional: true
    },
    orderPhone: {
        type: String,
        optional: true
    },
    unitNumber: {
        type: String,
        optional: true
    },
    buzzerNumber: {
        type: String,
        optional: true
    },
    streetNumber: {
        type: String,
        optional: true
    },
    street: {
        type: String,
        optional: true
    },
    city: {
        type: String,
        optional: true
    },
    postalCode: {
        type: String,
        optional: true
    },
    instructions: {
        type: String,
        optional: true
    },
});

Maestro.Schemas.Order = new SimpleSchema({
    businessId: {
        type: String
    },
    locationId: {
        type: String
    },
    status: {
        type: String, //Completed, Cancelled
        optional: true
    },
    orderInformation: {
        type: Maestro.Schemas.OrderInformation,
        optional: true
    },
    customerId: {
        type: String, //must be id of the Customer
        optional: true,
        defaultValue: null
    },
    waiterId: {
        type: String,
        optional: true
    },
    tableId: {
        type: String,
        optional: true
    },
    splitOrders: {
        type: [String],
        optional: true
    },
    originalOrderId: {
        type: String,
        optional: true
    },
    items: {
        type: [Maestro.Schemas.OrderItem],
        minCount: 1
    },
    subtotals: {
        type: Maestro.Schemas.OrderPriceSchema
    },
    payment: {
        type: Maestro.Schemas.PaymentInformation,
        optional: true
    },
    dailyOrderNumber: {//unique only for day and location
        type: Number,
        optional: true
    },
    uniqueOrderNumber:{//unique business wide
        type: Number,
        optional: true
    },
    createdBy: {
        type: String,
        optional: true,
        autoValue: function() {
            if (this.isInsert) {
                return this.userId;
            } else if (this.isUpsert) {
                return {$setOnInsert: this.userId};
            } else {
                this.unset();
            }
        }
    },
    createdAt: {
        type: Date,
        optional: true,
        // autoValue: function() {
        //     if (this.isInsert) {
        //         return new Date;
        //     } else if (this.isUpsert) {
        //         return {$setOnInsert: new Date};
        //     } else {
        //         this.unset();
        //     }
        // }
    },
    timeBucket: {
        type: Maestro.Schemas.TimeComponents,
        optional: true
    },
    updatedBy: {
        type: String,
        optional: true,
        autoValue: function() {
            if (this.isUpdate) {
                return this.userId;
            } else if (this.isUpsert) {
                return {$setOnUpdate: this.userId};
            } else {
                this.unset();
            }
        }
    },
    updatedAt: {
        type: Date,
        optional: true,
        autoValue: function() {
            if (this.isUpdate) {
                return new Date;
            } else if (this.isUpsert) {
                return {$setOnUpdate: new Date};
            } else {
                this.unset();
            }
        }
    }
});

Orders.attachSchema(Maestro.Schemas.Order);

Orders.allow({ 
    insert() { return true; }, 
    update() { return true; }, 
    remove() { return true; } 
}); 

Orders.deny({ 
    insert() { return false; }, 
    update() { return false; }, 
    remove() { return false; } 
});