Meteor.methods({
    customerNameExists: function (customerName) {
        var customers = Customers.find({name: customerName});
        return customers.count();
    },

    createCustomer: function (customerInfo) {
        check(customerInfo, Maestro.Schemas.Customer);

        try {
            customerId = Customers.insert(customerInfo);
        } catch (e) {
            console.log("Error creating customer: ", e);
        }

        return customerId;
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

    customerEmailExists: function (customerEmail) {
        var customers = Customers.find({email: customerEmail});
        return customers.count();
    },

    searchCustomers: function (searchTerm) {
        var searchSplit = searchTerm.split(":");
        let user = Meteor.users.findOne({_id: this.userId});
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
});