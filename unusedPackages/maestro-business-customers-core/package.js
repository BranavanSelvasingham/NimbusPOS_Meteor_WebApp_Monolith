Package.describe({
    name: 'maestro-business-customers-core',
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
    api.use('ecmascript');

    api.use('maestro-business-base');
    api.imply('maestro-business-base');

    api.imply('maestro-base', ['client', 'server']);
    api.use(['maestro-base', 'maestro-business-base-core'], ['client', 'server']);

    api.addFiles([
        'model/schemas/customers.js',
        'model/schemas/loyalty-programs.js',
        // 'model/customers-collection.js',
        // 'model/loyalty-programs-collection.js',
        'methods/customers.js',
        'methods/loyalty-programs.js',

        'model/customers-collection.js',
        'model/loyalty-programs-collection.js',

        'configurations.js',
        'permissions.js',
        'publications.js',
        'settings.js',
        'startup.js',
        'maestro-customers-core.js'
    ], server);

    api.export('Customers', both);
    api.export('LoyaltyPrograms', both);
});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('maestro-business-customers-core');
    api.addFiles('maestro-customers-core-tests.js');
});
