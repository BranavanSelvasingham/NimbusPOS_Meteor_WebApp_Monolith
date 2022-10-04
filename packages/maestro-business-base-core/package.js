Package.describe({
    name: 'maestro-business-base-core',
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
        'maestro-base',
        'maestro-users'
    ];

    api.versionsFrom('1.2.1');

    api.use(requiredPackages);
    api.imply(requiredPackages);

    api.addFiles([
        //lib
        'common/lib/base.js',
        'common/lib/maestro-business-collections.js',
        'common/lib/utility-methods.js',
        'common/lib/locations.js',
        

        //schemas and models
        'common/model/schemas/businesses.js',
        'common/model/schemas/locations.js',
        'common/model/schemas/business-users.js',
        'common/model/business-collections.js',

        //configurations and settings
        'configurations.js',
        'settings.js',

        //methods
        'common/methods/businesses-methods.js',
        'common/methods/business-users-methods.js',
        'common/methods/locations-methods.js'

    ], both);

    api.addFiles([
        'server/base_server.js',
        'server/maestro-business-core-server.js',
        'server/maestro-business-collection-hooks.js',
        'server/permissions.js',
        'server/publications.js',
        'server/business-collection-publications.js'
    ], server);

    api.addFiles([
        'client/base_client.js',
        'client/maestro-business-core-client.js',
        'client/maestro-business-collection-hooks.js',
        'client/maestro-client.js',
        'client/startup.js',
        'client/subscriptions.js',
        'client/business-collection-subscriptions.js'
    ], client);

    api.export([
        'Businesses',
        'Locations',
        'BusinessUsers',
        'Business'
    ]);

});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('maestro-business-base-core');
});
