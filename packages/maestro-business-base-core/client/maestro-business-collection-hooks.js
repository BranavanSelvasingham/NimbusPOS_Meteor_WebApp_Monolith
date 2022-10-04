Maestro.CollectionsHooks.BusinessFilter = function(collection){
    collection.before.find(function (userId, selector, options) {
        selector.businessId = Maestro.Business.getBusinessId();
    });

    collection.before.findOne(function (userId, selector, options) {
        selector.businessId = Maestro.Business.getBusinessId();
    });

    collection.before.insert(function (userId, document) {
        document.businessId = Maestro.Business.getBusinessId();
    });
};