Expenses = new Mongo.Collection("expenses");

Maestro.Schemas.ExpenseTimeComponents = new SimpleSchema({
    year: {
        type: Number,
    },
    month: {
        type: Number,
    },
    day: {
        type: Number,
        optional: true
    },
    hour: {
        type: Number,
        optional: true
    }
});


Maestro.Schemas.Expense = new SimpleSchema({
    vendor: {
        type : String
    },
    businessId: {
        type: String
    },
    details: {
        type: String,
        optional: true
    },
    amount: {
        type: Number,
        decimal: true
    },
    tax: {
        type: Number,
        decimal: true,
        optional: true,
        defaultValue: 0.00
    },
    category: {
        type: String, 
        optional: true
    },
    taxable: {
        type: Boolean,
        optional: true
    },
    expenseDate: {
        type: Date
    },
    paymentMethod: { //out-of-pocket, out-of-register, card, invoiced
        type: String
    },
    timeBucket: {
        type: Maestro.Schemas.ExpenseTimeComponents,
        optional: true
    },
});

Expenses.attachSchema(Maestro.Schemas.Expense);

Expenses.allow({ 
    insert() { return true; }, 
    update() { return true; }, 
    remove() { return true; } 
}); 

Expenses.deny({ 
    insert() { return false; }, 
    update() { return false; }, 
    remove() { return false; } 
});