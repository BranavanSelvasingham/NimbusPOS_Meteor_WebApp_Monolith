let businessBaseSchema = new SimpleSchema({
    businessId: {
        type: String,
        index: true,
        denyUpdate: true
    },
    locations: {
        type: [String],
        optional: true,
        defaultValue: null
    }
});

//Extend existing Maestro.Collection Class
Maestro.BusinessCollection = class MaestroBusinessCollection extends Maestro.Collection {
    constructor(name, schema, permissions, autoSubscribe = true, mongoCollectionsOptions) {
        check(name, String);
        check(schema, Match.OneOf(Object, SimpleSchema));

        //Call super with modified schema
        super(name, new SimpleSchema(schema, businessBaseSchema), permissions, mongoCollectionsOptions);

        const businessCollection = this;
        const publicationName = name + "Publication";

        //Defer publication, subscription and hooks creation on the collection
        Meteor.defer(function() {

            //publish collection
            if(Meteor.isServer) {
                Maestro.publish(businessCollection, publicationName);
            }

            //subscribe to collection
            if(Meteor.isClient) {
                if(autoSubscribe) {
                    Maestro.subscribe(publicationName);
                }
            }

            //apply collection hooks
            // Maestro.CollectionsHooks.BusinessFilter(businessCollection);

            //todo enforce permissions
        });
    }
};
