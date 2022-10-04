
methodsSymbol = Symbol.for("methods");

BusinessCustomers = new class {
    constructor() {
        __customersCollection = Customers; //new Maestro.BusinessCollection("customers", Maestro.Schemas.Customer);

        this._moduleName = "customers";
        this._collection = __customersCollection;
        this[methodsSymbol] = new Map();

        //todo revisit permissions
        this._permissions = [
            'access',
            'create',
            'update',
            'remove',
            'execute'
        ];

        this.Methods = {
            createCustomer: new ValidatedMethod({
                name: "customer.create",

                validate: new SimpleSchema({
                    businessId: { type: String },
                    name: { type: String },
                    email: { type: String }
                }).validator(),

                run({businessId, name, email}) {
                    if(this.isSimulation) {
                        if (!this.userId) {
                            // Throw errors with a specific error code
                            throw new Meteor.Error('Customer.create.notLoggedIn',
                                'Must be logged in to create a customer.');
                        }

                        const currentUser = Meteor.users.findOne({_id: this.userId});

                        //todo check for access to business
                        if (!businessId) {
                            throw new Meteor.Error('Customer.create.noBusinessId',
                                'No business specified for the customer.');
                        }
                    }

                    //todo check user permissions
                    return __customersCollection.insert({businessId, name, email});
                }
            }),

            //Remove Customer
            removeCustomer: new ValidatedMethod({
                name: "customer.remove",

                validate: new SimpleSchema({
                    id: { type: String }
                }).validator(),

                run({id}) {
                    if(this.isSimulation) { //todo remove simulation mode
                        if (!this.userId) {
                            // Throw errors with a specific error code
                            throw new Meteor.Error('Customer.remove.notLoggedIn',
                                'Must be logged in to remove a customer.');
                        }

                        const currentUser = Meteor.users.findOne({_id: this.userId});

                        //todo check for access to business
                        if (!businessId) {
                            throw new Meteor.Error('Customer.create.noBusinessId',
                                'No business specified for the customer.');
                        }
                    }

                    //todo check user permissions to remove
                    return __customersCollection.remove({_id: id});
                }
            }),

            //Update Customer Details
            updateCustomer: new ValidatedMethod({
                name: "customer.update",

                validate: new SimpleSchema({
                    id: { type: String },
                    name: { type: String, optional: true },
                    email: { type: String, optional: true }
                }).validator(),

                run({id, name, email}) {
                    if(this.isSimulation) { //todo remove simulation mode
                        if (!this.userId) {
                            // Throw errors with a specific error code
                            throw new Meteor.Error('Customer.update.notLoggedIn',
                                'Must be logged in to update a customer.');
                        }

                        const currentUser = Meteor.users.findOne({_id: this.userId});

                        //todo check for access to business
                        if (!businessId) {
                            throw new Meteor.Error('Customer.create.noBusinessId',
                                'No business specified for the customer.');
                        }
                    }

                    //todo check user permissions
                    let updateObject = {};
                    if(name) {
                        updateObject.name = name;
                    }

                    if(email) {
                        updateObject.email = email;
                    }

                    return __customersCollection.update({_id: id}, {$set: updateObject});
                }
            })
        };
    }

    list() {
        __customersCollection.find({});
    }

    createCustomer(businessId, name, email) {
        return this.Methods.createCustomer.call({businessId, name, email});
    }

    removeCustomer(id) {
        return this.Methods.removeCustomer.call({id});
    }

    updateCustomerDetails(id, details) {
        let {name, email} = details;
        return this.Methods.updateCustomer.call({id, name, email});
    }

    updateCustomerName(id, name) {
        return this.Methods.updateCustomer.call({id, name});
    }

    updateCustomerEmail(id, email) {
        return this.Methods.updateCustomer.call({id, email});
    }

    findCustomerById(id) {
        return __customersCollection.findOne({_id: id});
    }

    findCustomersByEmail(email) {
        return __customersCollection.find({email});
    }

    countCustomersByEmail(email) {
        return __customersCollection.find({email}).count();
    }

}();
