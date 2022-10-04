Maestro.Schemas.AddressSchema = new SimpleSchema({
    street: {
        type: String,
        max: 100
    },
    city: {
        type: String,
        max: 50
    },
    state: {
        type: String
    },
    pin: {
        type: String,
        // regEx: /^\w{6}|\w{3}\s{1}\w{3}$/
    },
    country: {
        type: String
    }
});