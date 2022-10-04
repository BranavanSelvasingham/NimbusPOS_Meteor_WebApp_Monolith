Tables = new Mongo.Collection("tables");

Maestro.Schemas.Seats = new SimpleSchema({
    orderId: {
        type: String,
        optional: true
    },
    seatLabel: {
        type: String,
        optional: true
    },
});

Maestro.Schemas.Coordinates = new SimpleSchema({
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

Maestro.Schemas.Table = new SimpleSchema({
    businessId: {
        type: String
    },
    locationId: {
        type: String,
    },
    status: {
        type: String,
        optional: true,
    },
    waiter: {
        type: String,
        optional: true,
    },
    tableLabel: {
        type: String,
        optional: true,
    },
    defaultSeats: {
        type: Number,
        optional: true,
    },
    seats: {
        type: Number,
        optional: true,
    },
    orders: {
        type: [String], //array of order ids
        optional: true
    },
    shape: {
        type: String,
        optional: true
    },
    position: {
        type: Maestro.Schemas.Coordinates,
        optional: true,
    }

    // customerId: {
    //     type: String, //must be id of the Customer
    //     optional: true,
    //     defaultValue: null
    // },
    // items: {
    //     type: [Maestro.Schemas.OrderItem],
    //     minCount: 1
    // },
    // subtotals: {
    //     type: Maestro.Schemas.OrderPriceSchema
    // },
    // payment: {
    //     type: Maestro.Schemas.PaymentInformation,
    //     optional: true
    // },
    // dailyOrderNumber: {//unique only for day and location
    //     type: Number,
    //     optional: true
    // },
    // uniqueOrderNumber:{//unique business wide
    //     type: Number,
    //     optional: true
    // },
    // createdBy: {
    //     type: String,
    //     optional: true,
    //     autoValue: function() {
    //         if (this.isInsert) {
    //             return this.userId;
    //         } else if (this.isUpsert) {
    //             return {$setOnInsert: this.userId};
    //         } else {
    //             this.unset();
    //         }
    //     }
    // },
    // createdAt: {
    //     type: Date,
    //     optional: true,
    //     // autoValue: function() {
    //     //     if (this.isInsert) {
    //     //         return new Date;
    //     //     } else if (this.isUpsert) {
    //     //         return {$setOnInsert: new Date};
    //     //     } else {
    //     //         this.unset();
    //     //     }
    //     // }
    // },
    // timeBucket: {
    //     type: Maestro.Schemas.TimeComponents,
    //     optional: true
    // },
    // updatedBy: {
    //     type: String,
    //     optional: true,
    //     autoValue: function() {
    //         if (this.isUpdate) {
    //             return this.userId;
    //         } else if (this.isUpsert) {
    //             return {$setOnUpdate: this.userId};
    //         } else {
    //             this.unset();
    //         }
    //     }
    // },
    // updatedAt: {
    //     type: Date,
    //     optional: true,
    //     autoValue: function() {
    //         if (this.isUpdate) {
    //             return new Date;
    //         } else if (this.isUpsert) {
    //             return {$setOnUpdate: new Date};
    //         } else {
    //             this.unset();
    //         }
    //     }
    // }
});

Tables.attachSchema(Maestro.Schemas.Table);

Tables.allow({ 
    insert() { return true; }, 
    update() { return true; }, 
    remove() { return true; } 
}); 

Tables.deny({ 
    insert() { return false; }, 
    update() { return false; }, 
    remove() { return false; } 
});