Package.describe({
    name: 'maestro-business-customers-ui',
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
        'materializecss',
        'maestro-business-customers-core'
    ], client);

    api.addFiles([
        'views/createCustomer.html',
        'views/createCustomer.js',
        'views/listCustomers.html',
        'views/listCustomers.js',

        //Loyalty Programs
        'views/loyalty-programs/createLoyaltyProgram.html',
        'views/loyalty-programs/createLoyaltyProgram.js',
        'views/loyalty-programs/listLoyaltyPrograms.html',
        'views/loyalty-programs/listLoyaltyPrograms.js',

        'customers-subscriptions.js',
        'loyalty-programs-subscriptions.js'
    ], client);
});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('maestro-business-customers-ui');
});
