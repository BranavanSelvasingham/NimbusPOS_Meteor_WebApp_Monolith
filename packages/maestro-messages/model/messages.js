Messages = new Mongo.Collection("messages");

Maestro.Schemas.MessageTimeComponents = new SimpleSchema({
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
    },
    minute:{
        type: Number,
        optional: true
    }, 
    seconds: {
        type: Number,
        optional: true
    }
});


Maestro.Schemas.Message = new SimpleSchema({
    conversationId: {
        type: String,
    },
    businessId: {
        type: String,
        optional: true
    },
    locationId: {
        type: String,
        optional: true
    },
    createdAt: {
        type: Date
    },
    supportMessage:{
        type: Boolean
    },  
    customerMessage:{
        type: Boolean
    },
    timeBucket: {
        type: Maestro.Schemas.MessageTimeComponents,
        optional: true
    },

    messageText: {
        type: String
    }
});

Messages.attachSchema(Maestro.Schemas.Message);

Messages.allow({ 
    insert() { return true; }, 
    update() { return true; }, 
    remove() { return true; } 
}); 

Messages.deny({ 
    insert() { return false; }, 
    update() { return false; }, 
    remove() { return false; } 
});