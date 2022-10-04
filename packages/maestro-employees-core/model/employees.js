Employees = new Mongo.Collection("employees");

Maestro.Schemas.EmployeeHours = new SimpleSchema({
    date: {
        type: Date,
        optional: true
    },
    hours: {
        type: Number,
        decimal: true,
        optional: true,
    },
    clockIn: {
        type: Date,
        optional: true
    },
    clockOut: {
        type: Date,
        optional: true
    },
    pay: {
        type: Number,
        decimal: true,
        optional: true
    }
});

Maestro.Schemas.Employee = new SimpleSchema({
    name: {
        type: String
    },
    businessId: {
        type: String
    },
    phone: {
        type: Number,
        optional: true
    },
    pin:{
        type: String,
        optional: true,
        defaultValue: '0000'
    },
    email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
        optional: true
    },
    plannedHours: {
        type: [Maestro.Schemas.EmployeeHours],
        optional: true
    },

    actualHours:{
        type: [Maestro.Schemas.EmployeeHours],
        optional: true
    },
    status: {
        type: String,
        optional: true
    },
    rate: {
        type: Number, //hourly rate
        decimal: true,
        optional: true
    }
});

Employees.attachSchema(Maestro.Schemas.Employee);

Employees.allow({ 
    // insert() { return true; }, 
    update() { return true; }, 
    // remove() { return true; } 
}); 

Employees.deny({ 
    // insert() { return false; }, 
    update() { return false; }, 
    // remove() { return false; } 
});