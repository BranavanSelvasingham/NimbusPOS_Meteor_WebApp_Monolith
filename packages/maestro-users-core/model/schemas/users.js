Maestro.Schemas.UserProfile = new SimpleSchema({
    firstName: {
        type: String,
        optional: true
    },
    lastName: {
        type: String,
        optional: true
    },
    online: {
        type: String,
        optional: true,
        blackbox: true
    },
    businessId: {
        type: String,
        optional: true
    },
    businessUserId: {
        type: String,
        optional: true
    }
});

Maestro.Schemas.User = new SimpleSchema({
    username: {
        type: String,
        regEx: /^[a-z0-9A-Z_]{3,30}$/
    },
    emails: {
        type: [Object],
        optional: true
    },
    "emails.$.address": {
        type: String,
        regEx: SimpleSchema.RegEx.Email
    },
    "emails.$.verified": {
        type: Boolean
    },
    status: {
        type: Object,
        optional: true,
        blackbox: true
    },
    loginDisabled: {
        type: Boolean,
        optional: true,
    },
    isEndCustomer: {
        type: Boolean,
        optional: true
    },
    services: {
        type: Object,
        optional: true,
        blackbox: true
    },
    profile: {
        type: Maestro.Schemas.UserProfile,
        optional: true
    },
    roles: {
        type: [String],
        optional: true
    },
    createdBy: {
        type: String,
        denyUpdate: true,
        optional: true,
        autoValue: function() {
            if(!!this.userId) {
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
        optional: true,
        autoValue: function() {
            if (this.isInsert) {
                return new Date;
            } else if (this.isUpsert) {
                return {$setOnInsert: new Date};
            }
        }
    },
    updatedBy: {
        type: String,
        denyInsert: true,
        optional: true,
        autoValue: function() {
            if(!!this.userId) {
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
            if (this.isUpdate) {
                return new Date;
            } else if (this.isUpsert) {
                return {$setOnUpdate: new Date};
            }
        }
    }
});
