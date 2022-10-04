Package.describe({
    name: 'maestro-users-ui',
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

    api.versionsFrom('1.2.1');

    api.use([
        'ecmascript',
        'templating',
        'mongo',
        'underscore',
        'session',
        'jquery',
        'session',
        'amplify',
        'maestro-users-core',
        'materializecss'
    ], client);

    api.addFiles([
        'subscriptions.js',
        'preferences.js',
        'startup.js',
        'views/createUser.html',
        'views/createUser.js',
        'views/loginUser.html',
        'views/loginUser.js',
        'maestro-users-ui.js'
    ], client);
});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('maestro-users-ui');
    api.addFiles('maestro-users-ui-tests.js');
});
