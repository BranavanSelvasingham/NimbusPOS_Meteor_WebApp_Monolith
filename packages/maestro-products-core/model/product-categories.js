ProductCategories = new Mongo.Collection("productcategories");

Maestro.Schemas.ProductCategory = new SimpleSchema({
    name: {
        type: String
    },
    color: {
        type: String,
        optional: true,
        // allowedValues: Maestro.Colors,
        // defaultValue: "clouds"
    },
    businessId: {
        type: String
    },
    sortPosition: {
        type: Number,
        optional: true,
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

ProductCategories.attachSchema(Maestro.Schemas.ProductCategory);