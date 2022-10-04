Businesses = new Mongo.Collection("businesses");

Maestro.Schemas.BusinessProductSize = new SimpleSchema({
    code: {
        type: String,
        allowedValues: _.pluck(Maestro.Products.Sizes, "code")
    },
    label: {
        type: String
    },
    preferred: {
        type: Boolean
    },
    available: {
        type: Boolean
    },
    order: {
        type: Number
    }
});

Maestro.Schemas.BusinessConfiguration = new SimpleSchema({
    sizes: {
        type: [Maestro.Schemas.BusinessProductSize]
    }, 

    emailHoursReminder: {
        type: Boolean,
        optional: true
    }
});

Maestro.Schemas.BusinessPayroll = new SimpleSchema({
    referenceStartDate: {
        type: Date
    },
    frequencyType: {
        type: String // weekly, biweekly, monthly
    }
});

Maestro.Schemas.BusinessBilling = new SimpleSchema({
    stripeCustomerId: {
        type: String,
        optional: true
    }
});

Maestro.Schemas.Business = new SimpleSchema({
    name: {
        type: String,
        index: true,
        unique: true
    },
    description: {
        type: String,
        optional: true,
        defaultValue: ''
    },
    phone: {
        type: Number,
        optional: true
    },
    configuration: {
        type: Maestro.Schemas.BusinessConfiguration
    },
    payroll: {
        type: Maestro.Schemas.BusinessPayroll,
        optional: true
    },
    billing: {
        type: Maestro.Schemas.BusinessBilling,
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

Businesses.attachSchema(Maestro.Schemas.Business);
