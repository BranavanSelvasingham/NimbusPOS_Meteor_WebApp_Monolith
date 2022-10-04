ProductAddons = new Mongo.Collection("productaddons");

Maestro.Schemas.ProductAddon = new SimpleSchema({
    name: {
        type: String 
    },
    price: {
        type: Number,
        decimal: true,
        defaultValue: 0.00
    },
    categories:{
        type: [String],
        optional: true
    },
    isSubstitution: {
        type: Boolean,
        optional: true
    },
    businessId: {
        type: String
    },
    status:{
        type: String
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

ProductAddons.attachSchema(Maestro.Schemas.ProductAddon);

ProductAddons.allow({ 
    insert() { return true; }, 
    update() { return true; }, 
    remove() { return true; } 
}); 

ProductAddons.deny({ 
    insert() { return false; }, 
    update() { return false; }, 
    remove() { return false; } 
});