Package.describe({
    name: 'maestro-notifications',
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
    api.use('email', ['server']);

    api.use(['maestro-base', 'maestro-business-base-core'], ['client', 'server']);

    api.addFiles('maestro_notifications.js');
    api.addFiles('maestro_notifications_client.js', 'client');
    api.addFiles('maestro_notifications_server.js', 'server');

    api.addFiles('lib/notifications.js');
    api.addFiles('methods/notificationsMethods.js', 'server');
    api.addFiles('maestro_notifications_email_server.js','server');
});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('maestro-notifications');
    api.addFiles('maestro_notifications_tests.js');
});
