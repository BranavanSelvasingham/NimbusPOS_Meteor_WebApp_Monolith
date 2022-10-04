Invoices = new Mongo.Collection("invoices");

Maestro.Schemas.LineItem = new SimpleSchema({
    description: {
        type: String
    },
    amount: {
        type: Number,
        decimal: true,
        optional: true
    },
});

Maestro.Schemas.Invoice = new SimpleSchema({
    businessId: {
        type: String
    },
    pricingPlanType:{
        type: String, //SALES_BASED_PRICE (or null), LOCATION_BASED_PRICE
        optional: true,
    },
    billingYear: {
        type: Number
    },
    billingMonth: {
        type: Number //0=January, 11 = December
    },
    sales: {
        type: Number,
        decimal: true
    },
    orders: {
        type: Number
    },
    lineItems: {
        type: [Maestro.Schemas.LineItem],
        optional: true
    },
    paymentDue: {
        type: Number,
        decimal: true
    },
    paymentDueDate: {
        type: Date
    },
    paymentReceived: {
        type: Number,
        decimal: true,
        optional: true
    },
    paymentReceivedDate: {
        type: Date,
        optional: true
    },
    status: {
        type: String //Invoiced, Paid,..
    },
    paymentMethod: {
        type: String,
        optional: true
    },
    paymentReferenceNumber: {
        type: String,
        optional: true
    }
});

Invoices.attachSchema(Maestro.Schemas.Invoice);

