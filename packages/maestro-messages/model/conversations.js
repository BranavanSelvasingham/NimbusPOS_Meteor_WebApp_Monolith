Conversations = new Mongo.Collection("conversations");

Maestro.Schemas.Conversation = new SimpleSchema({
    businessId: {
        type: String
    },
    supportConversation: {
        type: Boolean
    },
    customerConversation: {
        type: Boolean
    }
});

Conversations.attachSchema(Maestro.Schemas.Conversation);

Conversations.allow({ 
    insert() { return true; }, 
    update() { return true; }, 
    remove() { return true; } 
}); 

Conversations.deny({ 
    insert() { return false; }, 
    update() { return false; }, 
    remove() { return false; } 
});