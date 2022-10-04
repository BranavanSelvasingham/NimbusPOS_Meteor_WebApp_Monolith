BusinessUsers = new Mongo.Collection("business.users");

Maestro.Schemas.BusinessUserPersona = new SimpleSchema({
    locationId: {
        type: String // must be user id
    },
    role: {
        type: String,
        optional: true
    }
});

Maestro.Schemas.BusinessUser = new SimpleSchema({
    userId: {
        type: String // must be user id
    },
    businessId: {
        type: String // must be business id
    },
    role: {
        type: String // role id
    },
    status: {
        type: String,
        allowedValues: Maestro.User.Status.keys()
    },
    persona: {
        type: [Maestro.Schemas.BusinessUserPersona],
        optional: true,
        defaultValue: null
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

BusinessUsers.attachSchema(Maestro.Schemas.BusinessUser);