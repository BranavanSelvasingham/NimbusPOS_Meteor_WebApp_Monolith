Maestro.CollectionsHooks.BusinessFilter = function(collection){
    collection.before.find(function (userId, selector, options) {
        if(!Maestro.Business.isActiveBusinessUser(userId, selector.businessId)) {
            return false;
        }
    });

    collection.before.findOne(function (userId, selector, options) {
        if(!Maestro.Business.isActiveBusinessUser(userId, selector.businessId)) {
            return false;
        }
    });

    collection.before.insert(function (userId, doc) {
        if(!Maestro.Business.isActiveBusinessUser(userId, doc.businessId)) {
            return false;
        }
    });

    collection.before.update(function (userId, doc, fieldNames, modifier, options) {
        if(!Maestro.Business.isActiveBusinessUser(userId, doc.businessId)) {
            return false;
        }
    });

    collection.before.remove(function (userId, doc) {
        if(!Maestro.Business.isActiveBusinessUser(userId, doc.businessId)) {
            return false;
        }
    });

    //todo check availability of 'upsert' on collections
    /*collection.before.upsert(function (userId, selector, modifier, options) {
        if(!Maestro.Business.isActiveBusinessUser(userId, selector.businessId)) {
            return false;
        }
    });*/
};