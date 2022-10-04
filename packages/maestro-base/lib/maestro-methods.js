Maestro.Method = class MaestroMethod extends ValidatedMethod {
    constructor(name, permissions, mixins, validate, run) {
        super({name, mixins, validate, run});

        //keep permissions with the method
        this.permissions = permissions;

        //todo handle permissions

    }
};