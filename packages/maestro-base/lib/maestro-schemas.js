Maestro.Schemas.AuditSchema = new SimpleSchema({
    createdBy: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        denyUpdate: true,
        optional: true, //todo
        autoValue: function() {
            if((Meteor.isClient) || (Meteor.isServer && !this.isSet)) {
                if (this.isInsert) {
                    return this.userId;
                } else if (this.isUpsert) {
                    return {$setOnInsert: this.userId};
                }
            }
        }
    },
    createdAt: {
        type: Date,
        denyUpdate: true,
        //optional: true,
        autoValue: function() {
            if((Meteor.isClient) || (Meteor.isServer && !this.isSet)) {
                if (this.isInsert) {
                    return new Date;
                } else if (this.isUpsert) {
                    return {$setOnInsert: new Date};
                }
            }
        }
    },
    updatedBy: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        denyInsert: true,
        optional: true,
        autoValue: function() {
            if((Meteor.isClient) || (Meteor.isServer && !this.isSet)) {
                if (this.isUpdate) {
                    return this.userId;
                } else if (this.isUpsert) {
                    return {$setOnUpdate: this.userId};
                }
            }
        }
    },
    updatedAt: {
        type: Date,
        denyInsert: true,
        optional: true,
        autoValue: function() {
            if((Meteor.isClient) || (Meteor.isServer && !this.isSet)) {
                if (this.isUpdate) {
                    return new Date;
                } else if (this.isUpsert) {
                    return {$setOnUpdate: new Date};
                }
            }
        }
    }
});

Maestro.Schemas.Money = new SimpleSchema({
    amount: {
        type: Number,
        decimal: true
    },
    currency: {
        type: String
    }
});

Maestro.Schemas.AddressSchema = new SimpleSchema({
    street: {
        type: String,
        max: 100
    },
    city: {
        type: String,
        max: 50
    },
    state: {
        type: String
    },
    pin: {
        type: String,
        // regEx: /^\w{6}|\w{3}\s{1}\w{3}$/
    },
    country: {
        type: String
    }
});