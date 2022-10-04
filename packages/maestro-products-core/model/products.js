Products = new Mongo.Collection("products");

Maestro.Schemas.ProductSize = new SimpleSchema({
    code: {
        type: String,
        allowedValues: _.pluck(Maestro.Products.Sizes, "code")
    },
    price: {
        type: Number,
        decimal: true,
        defaultValue: 0.00
    }
});

Maestro.Schemas.Product = new SimpleSchema({
    name: {
        type: String,
        index: true
    },
    sortPosition: {
        type: Number,
        optional: true
    },
    description: {
        type: String,
        optional: true,
        defaultValue: null
    },
    status: {
        type: String,
        defaultValue: "Active"  //"Active", "Out of Season", "Archived"
    },
    businessId: {
        type: String
    },
    locations: {
        type: [String], //location id
        optional: true
    },
    categories: {
        type: [String], //name of category
        optional: true,
        defaultValue: []
    },
    group:{
        type: String,
        optional: true,
        defaultValue: null
    },
    sizes: {
        type: [Maestro.Schemas.ProductSize],
        minCount: 1
    },
    variablePrice: {
        type: Boolean,
        optional: true,
    },
    unitBasedPrice: {
        type: Boolean,
        optional: true,
    },
    unitLabel: {
        type: String,
        optional: true,
    },
    addOns: {
        type: [String], //prodouct-addon ids
        optional: true,
        defaultValue: null
    },
    taxRule: {
        type: String,
        optional: true,
        allowedValues: Maestro.Tax.Types.keys(),
        defaultValue: Maestro.Tax.Types.RETAIL_TAX.key
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
        autoValue: function() {
            if (this.isInsert) {
                return new Date;
            } else if (this.isUpsert) {
                return {$setOnInsert: new Date};
            } else {
                this.unset();
            }
        }
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

Products.attachSchema(Maestro.Schemas.Product);

