publishBusinessCollection = function(collection, publicationName) {
    Meteor.publish(publicationName, function(businessId) {
        if(this.userId) {
        	console.log("receiving bID:" + businessId);
            if (businessId) {
                return collection.find({businessId});
            }
        }

        return [];
    });
};

Maestro.publish = publishBusinessCollection;