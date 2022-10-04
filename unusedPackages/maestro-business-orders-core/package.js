Package.describe({
    name: 'maestro-orders-core',
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
    api.versionsFrom('1.2.1');
    api.use('ecmascript');

    api.use('maestro-base');
    api.imply('maestro-base');

    api.addFiles('maestro-orders-core.js');
});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('maestro-orders-core');
    api.addFiles('maestro-orders-core-tests.js');
});
