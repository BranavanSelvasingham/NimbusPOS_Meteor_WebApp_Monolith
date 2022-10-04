const auditSchema = new SimpleSchema({
    createdBy: {
        type: String,
        denyUpdate: true,
        optional: true, //todo remove optional
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
        denyUpdate: true,
        //optional: true,
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
        denyInsert: true,
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
        denyInsert: true,
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

Maestro.Collection = class MaestroCollection extends Mongo.Collection {
    constructor(name, schema, permissions = [], mongoCollectionsOptions = {}) {
        check(name, String);
        check(mongoCollectionsOptions, Match.Optional(Object));
        check(schema, Match.OneOf(Object, SimpleSchema));
        check(permissions, Match.Optional(Match.OneOf(Object, Array)));

        if(Maestro.Collections.has(name)) {
            throw Meteor.Error(`Collection with name ${name} already exists!`);
        }

        //call super Mongo.Collection
        super(name, mongoCollectionsOptions);

        //keep permissions with the method
        this.permissions = permissions;

        //attach SimpleSchema schema to collection; augmented by audit
        this.attachSchema(new SimpleSchema([schema, Maestro.Schemas.AuditSchema]));

        //keep a reference of this collection in our Map
        Maestro.Collections.set(name, this);

        //todo handle permissions

    }
};


