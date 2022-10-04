ExpenseCategories = new Mongo.Collection("expenseCategories");

Maestro.Schemas.ExpenseCategory = new SimpleSchema({
    name: {
        type: String
    },
    businessId: {
        type: String
    },
    taxable: {
        type: Boolean,
        optional: true
    }
});

ExpenseCategories.attachSchema(Maestro.Schemas.ExpenseCategory);