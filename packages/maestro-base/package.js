Package.describe({
    name: 'maestro-base',
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
        'check',
        'http',
        'tracker',
        'ecmascript',
        'underscore',
        'session',
        'reactive-var',
        'reactive-dict',
        //'dburles:collection-helpers',
        'matb33:collection-hooks',
        'aldeed:simple-schema',
        'aldeed:collection2',
        'zeroasterisk:s-enum',
        'mdg:validated-method',
        'alanning:roles@1.2.14'
    ];

    api.versionsFrom('1.2.1');

    api.use(requiredPackages);
    api.imply(requiredPackages);

    //add lib files and exports
    api.addFiles('lib/maestro.js');
    api.addFiles('lib/maestro-users.js');
    api.addFiles('lib/maestro-payments.js');
    api.addFiles('lib/maestro-methods.js');
    api.addFiles('lib/maestro-schemas.js');
    api.addFiles('lib/maestro-templates.js');
    api.addFiles('lib/maestro-collections.js');
    api.addFiles('lib/maestro-taxes.js');
    api.addFiles('lib/maestro-web-print.js');
    api.addFiles('model/addresses.js');

    api.export('Maestro');
});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('maestro-base');
    //api.addFiles('maestro_base_tests.js');
});
