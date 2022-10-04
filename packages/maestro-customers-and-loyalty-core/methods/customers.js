let _addToSetCustomerLoyalty = function(customerId, program){
    var added;
    try {
        added = Customers.update(customerId, {$addToSet: {loyaltyPrograms: program}});
        console.log("added: " + added);
    } catch(e){
        console.log("Error adding: " + e);
    }
};

Meteor.methods({
    customerNameExists: function (customerName) {
        let user = Meteor.users.findOne({_id: this.userId});
        let businessId = user.profile.businessId;
        var customers = Customers.find({name: customerName, businessId: businessId});
        return customers.count();
    },

    customerEmailExists: function (customerEmail) {
        let user = Meteor.users.findOne({_id: this.userId});
        let businessId = user.profile.businessId;
        var customers = Customers.find({email: customerEmail, businessId: businessId});
        return customers.count();
    },

    createCustomer: function (customerInfo) {
        check(customerInfo, Maestro.Schemas.Customer);
        customerInfo.tallyPrograms = [];

        let activeTallyPrograms = LoyaltyPrograms.find({'businessId': customerInfo.businessId, 'programType.type': 'Tally', 'status': 'Active'}).fetch();

        if(activeTallyPrograms.length){
            _.each(activeTallyPrograms, function(tallyProgram){
                customerInfo.tallyPrograms.push({
                    programId: tallyProgram._id,
                    tally: 0
                });
            });
        }

        try {
            customerId = Customers.insert(customerInfo);
        } catch (e) {
            console.log("Error creating customer: ", e);
        }

        return customerId;
    },

    addProgramToCustomer: function(customerId, program){
        _addToSetCustomerLoyalty(customerId, program);
    },

    editCustomer: function (customerId, customerDetails) {
        Customers.update(customerId, {$set: customerDetails});
    },

    deleteCustomer: function (customerId) {
        var updates;
        try {
            updates = Customers.remove(customerId);
            console.log('removed: ', updates);
        } catch (e) {
            console.log('error: ', e);
        }

    },

    searchCustomers: function (searchTerm) {
        var searchSplit = searchTerm.split(":");
        let user = Meteor.users.findOne({_id: this.userId});
        if(!!user){
            let businessId = user.profile.businessId;

            if (searchTerm == "" || !searchTerm) {
                return Customers.find({businessId: businessId}, {sort: {name: 1}}).fetch();
            } else if (searchSplit.length > 1 && searchSplit[0] == "Alphabet") {
                var allCustomers = Customers.find({businessId: businessId}, {sort: {name: 1}}).fetch();
                
                return _.filter(allCustomers, function (customer) {
                    return (customer.name[0] == searchSplit[1]) || (customer.name[0] == searchSplit[1].toLowerCase())
                });
            } else {
                return Maestro.UtilityMethods.RegExSearch(searchTerm, Customers, this.userId);
            }
        }
    },

    emailInstructionsTrackLoyalty: function(customerId){
        if(Meteor.isServer){
            Maestro.Contact.Customer.emailInstructionsTrackLoyalty(customerId);
        }
    },
});