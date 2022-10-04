class Permission {
    constructor(name) {
        this._name = name;

        this._access = false;
        this._create = false;
        this._read = false;
        this._update = false;
        this._remove = false;
        this._execute = false;
    }

    canAccess() {
        return this._access;
    }

    canCreate() {
        return this._create;
    }

    canRead() {
        return this._read;
    }

    canUpdate() {
        return this._update;
    }
    
    canRemove() {
        return this._remove;
    }
    
    canExecute() {
        return this._execute;
    }
    
    getObject() {
        return {
            name: this._name,
            access: this._access,
            create: this._create,
            read: this._read,
            update: this._update,
            remove: this._remove,
            execute: this._execute
        }
    }
}


//var _permissions = new Mongo.Collection("permissions");

