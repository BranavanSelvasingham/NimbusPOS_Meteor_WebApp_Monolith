Package.describe({
    name: 'maestro-numbers',
    version: '0.0.1',
    // Brief, one-line summary of the package.
    summary: 'Everything to do with numbers, money and currency',
    // URL to the Git repository containing the source code for this package.
    git: '',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('1.2.1');

    api.use('ecmascript');
    api.use('underscore');
    api.use('maestro-base', ['client', 'server']);

    api.addFiles('maestro_numbers.js');
});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('underscore');
    api.use('tinytest');
    api.use('maestro-numbers');

    api.addFiles('maestro_numbers_tests.js');
});
