Meteor.publish("admiral-business-users", function() {
    return BusinessUsers.find({});
});

Meteor.publish("admiral-business-cores", function(businessId) {
    if(!!businessId){
        return [
            Businesses.find({"businessId": businessId}),
            Locations.find({"businessId": businessId}),
            Meteor.users.find({"businessId": businessId})
        ];
    } else {
        return [
            Businesses.find({}),
            Locations.find({}),
            Meteor.users.find({})
        ];
    }
});

Meteor.publish("admiral-customers", function(businessId) {
    if(!!businessId){
        return [
            Customers.find({"businessId": businessId})
        ];
    } 
});

Meteor.publish("admiral-loyalty-cards", function(businessId) {
    if(!!businessId){
        return [
            LoyaltyCards.find({"businessId": businessId}),
            LoyaltyPrograms.find({"businessId": businessId})
        ];
    } 
});

Meteor.publish("admiral-loyalty-programs", function(businessId) {    
    if(!!businessId){
        return [
            LoyaltyPrograms.find({"businessId": businessId})
        ];
    }
});

Meteor.publish("admiral-employees", function(businessId) {
    if(!!businessId){
        return [
            Employees.find({"businessId": businessId})
        ];
    } else {
        return [
            Employees.find({})
        ];
    }
});

Meteor.publish("admiral-expenses", function(businessId) {  
    if(!!businessId){
        return [
            Expenses.find({"businessId": businessId})
        ];
    } else {
        return [
            Expenses.find({})
        ];
    }
});

Meteor.publish("admiral-orders-start-end-date", function(businessId, fromDate, toDate) {
    startDate = fromDate;

    if(!!toDate){
        endDate = toDate;
    } else {
        endDate = startDate;
        endDate.setDate(endDate.getDate()+1);
    }

    if(!!businessId) {
        return [
            Orders.find({"businessId": businessId, "createdAt": {$gt:startDate, $lt:endDate}}, {sort: {"createdAt": -1}})
        ];
    } else {
        return [
            Orders.find({"createdAt": {$gt:startDate, $lt:endDate}}, {sort: {"createdAt": -1}})
        ];
    }

});

Meteor.publish("admiral-orders-start-end-date-location", function(businessId, locationId, fromDate, toDate) {
    var startDate, endDate;

    startDate = fromDate;

    if(!!toDate){
        endDate = toDate;
    } else {
        endDate = startDate;
        endDate.setDate(endDate.getDate()+1);
    }

    if(!!businessId && !!locationId) {
        return [
            Orders.find({"businessId": businessId, "locationId": locationId, "createdAt": {$gt:startDate, $lt:endDate}}, {sort: {"createdAt": -1}})
        ];
    } 
    //no user - no data to be published
    return [];
});

Meteor.publish("admiral-orders-limit", function(businessId, limit) {
    if(!!businessId) {
        return [
            Orders.find({"businessId": businessId}, {sort: {"createdAt": -1}, limit: limit})
        ];
    } else {
        return [
            Orders.find({}, {sort: {"createdAt": -1}, limit: limit})
        ];
    }
    
});

Meteor.publish("admiral-orders-location-specific", function(businessId, locationId, limit){
    if(!!businessId && !!locationId) {
        return [
            Orders.find({"businessId": businessId,  "locationId": locationId}, {sort: {"createdAt": -1}, limit: limit})
        ];
    }

    return [];
});

Meteor.publish("admiral-orders-uniquenumber", function(businessId, orderNumber){
    if(!orderNumber || orderNumber < 100){
        return [];
    }

    if(!!businessId) {       
        return [
            Orders.find({"businessId": businessId,  "uniqueOrderNumber": orderNumber}, {sort: {"createdAt": -1}, limit: 20})
        ];
    }
    //no user - no data to be published
    return [];
});

Meteor.publish("admiral-products", function(businessId) {
    if(!!businessId) {
        return [
            Products.find({"businessId": businessId}),
            ProductCategories.find({"businessId": businessId}),
            ProductAddons.find({"businessId": businessId}),
        ]; 
    } else {
        return [
            Products.find({}),
            ProductCategories.find({}),
            ProductAddons.find({}),
        ]; 
    }
    //no user - no data to be published
    return [];
});

Meteor.publish("admiral-users", function(){
    return [Meteor.users.find({})];
});

Meteor.publish("admiral-godview", function(businessId){
    return [
        BusinessUsers.find({"businessId": businessId}),
        Businesses.find({"businessId": businessId}),
        Customers.find({"businessId": businessId}),
        Employees.find({"businessId": businessId}),
        Expenses.find({"businessId": businessId}),
        Invoices.find({"businessId": businessId}),
        Locations.find({"businessId": businessId}),
        LoyaltyPrograms.find({"businessId": businessId}),
        Notes.find({"businessId": businessId}),
        Orders.find({"businessId": businessId}),
        ProductAddons.find({"businessId": businessId}),
        ProductCategories.find({"businessId": businessId}),
        Products.find({"businessId": businessId}),
        Reminders.find({"businessId": businessId}),
        Tables.find({"businessId": businessId}),
        Messages.find({}),
        Conversations.find({})
    ];
});

Meteor.publish("admiral-conversations", function(){
    return [
        Messages.find({}),
        Conversations.find({})
    ];
});