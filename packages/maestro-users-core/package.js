Package.describe({
    name: 'maestro-users-core',
    version: '0.0.1',
    // Brief, one-line summary of the package.
    summary: '',
    // URL to the Git repository containing the source code for this package.
    git: '',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Package.onUse(function (api) {
    var both = ['client', 'server'];
    var server = 'server';
    var client = 'client';

    const requiredPackages = [
        'ecmascript',
        'templating',
        'mongo',
        'underscore',
        'session',
        'amplify',
        'jquery',
        'maestro-base',
        'accounts-base',
        'accounts-password',
        'mizzao:user-status'
        /*
        'accounts-facebook',
        'accounts-github',
        'accounts-google',
        'accounts-meetup',
        'accounts-twitter',
        'accounts-weibo',
        'accounts-oauth',
        'accounts-meteor-developer',
        */
    ];

    api.versionsFrom('1.2.1');

    api.use(requiredPackages, both);
    api.imply([
        'maestro-base',
        'accounts-base',
        'accounts-password',
        'mizzao:user-status'
    ], both);

    api.addFiles([
        'model/schemas/users.js',
        'model/users-collection.js',
        'methods/user-methods.js',
        'maestro-users-core.js',
        'configurations.js',
        'permissions.js',
        'settings.js',
        'startup.js'
    ], both);

    api.addFiles([
        'server/maestro-user-session-server.js',
        'server/accounts-email-server.js',
        'server/publications.js',
        'server/loginValidation.js',
    ], server);

    api.addFiles([
        'client/maestro-user-session-client.js',
        'client/accounts-email-client.js'
    ], client);

    api.export([
        'UserSession'
    ]);
});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('maestro-users-core');
    api.addFiles('maestro-users-core-tests.js');
});
