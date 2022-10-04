__userSession = new Mongo.Collection("user-session");

UserSession = class {
    static all(userId, connectionId) {
        let selector = { userId: userId, connectionId: connectionId };

        let userSession = __userSession.findOne(selector);
        return userSession ? userSession : null;
    }

    static set(key, value, userId, connectionId) {
        let selector = { userId: userId, connectionId: connectionId };

        let userSession = __userSession.findOne(selector);

        if(userSession) {
            __userSession.update(selector, {$set: {[key]: value}});
        }
    }

    static get(key, userId, connectionId) {
        let selector = {userId: userId, connectionId: connectionId};

        let userSession = __userSession.findOne(selector);

        return userSession[key] || null;
    }

    static remove(key, userId, connectionId) {
        let selector = { userId: userId, connectionId: connectionId };

        __userSession.update(selector, {$unset: { [key]: 1 }});
    }

    static search(key, value) {
        let selector = {
            [key]: value
        };

        return __userSession.find(selector).fetch();
    }
};

//Add usersession to Maestro namespace
Maestro.UserSession = UserSession;

// Meteor methods
Meteor.methods({
    "user.session.all": function() {
        return UserSession.all(this.userId || null, this.connection.id);
    },
    "user.session.get": function(key) {
        return UserSession.get(key, this.userId || null, this.connection.id);
    },
    "user.session.set": function(key, value) {
        UserSession.set(key, value, this.userId || null, this.connection.id);
    },
    "user.session.remove": function(key) {
        UserSession.remove(key, this.userId || null, this.connection.id);
    },
    "user.session.search": function(key, value) {
        return UserSession.search(key, value);
    }
});

//Create user session on connection
Meteor.onConnection(function(connection) {
    let {id: connectionId} = connection;

    __userSession.insert({
        connectionId: connectionId,
        connectedAt: new Date,
        userId: null,
        loginAt: null
    });

    connection.onClose(function() {
        //todo decide if session needs to be kept here
        // __userSession.update({connectionId}, {$set: {disconnectedAt: new Date}});
        __userSession.remove({connectionId});
    });
});

//Update user session on login
Accounts.onLogin(function(userConnection) {
    let { user: {_id: userId}, connection: {id: connectionId}} = userConnection;

    let clientSession = __userSession.findOne({connectionId});
    if(clientSession) {
        __userSession.update({connectionId}, {$set: {userId: userId, loginAt: new Date}});
    } else {
        __userSession.insert({
            connectionId: connectionId,
            connectedAt: new Date,
            userId: userId,
            loginAt: new Date
        });
    }
});

let __cleanupUserSession = function() {
    __userSession.remove({connectionId: { $nin: _.keys(Meteor.server.sessions) } });
};

Meteor.startup(__cleanupUserSession);