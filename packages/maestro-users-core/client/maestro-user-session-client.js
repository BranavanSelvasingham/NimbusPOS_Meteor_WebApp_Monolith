function restoreSession() {
    _.each(amplify.store(), function(value, key) {
        Session.set(key, value);
        UserSession.set(key, value);
    });
}

function clearSession() {
    _.each(amplify.store(), function(value, key) {
        Session.set(key, null);
        amplify.store(key, null);
        Meteor.call("user.session.remove.all", function(error, result) {
            if(error) {
                console.error("Error persisting session value on server");
            }
        });
    });
}

UserSession = class {
    static all() {
        return _.object(_.map(amplify.store(), function(value, key) {
            return [key, JSON.stringify(value)]
        }));
    }

    static get(key) {
        return Session.get(key);
    }

    static set(key, value) {
        Session.set(key, value);
        amplify.store(key, value);
        Meteor.call("user.session.set", key, value);
    }

    static remove(key) {
        Session.set(key, null);
        amplify.store(key, null);
        Meteor.call("user.session.remove", key);
    }

    static removeAll() {
        clearSession();
    }

    static setRaw(key, value) {
        Session.set(key, value);
        Meteor._localStorage.setItem(key, value);
        Meteor.call("user.session.set", key, value);
    }

    static getRaw(key) {
        Tracker.nonreactive(function() {
            let rawSessionKey = Session.get(key);
            let rawStoredKey = Meteor._localStorage.getItem(key);

            if(!rawSessionKey && rawStoredKey) {
                Session.setDefault(key, rawStoredKey);
            }
        });

        return Session.get(key);
    }

    static removeRaw(key) {
        Session.set(key, null);
        Meteor._localStorage.removeItem(key);
        Meteor.call("user.session.remove", key);
    }
    
    static search(key, value, callbackFunction) {
        Meteor.call("user.session.search", key, value, function(error, result) {
            if(callbackFunction && typeof callbackFunction === 'function') {
                callbackFunction.apply(this, arguments);
            }
        });
    }

    static restoreSession() {
        restoreSession();
    }
};

Maestro.UserSession = UserSession;

//Restore session on load
restoreSession();