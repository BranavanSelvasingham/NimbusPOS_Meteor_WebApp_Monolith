Package.describe({
  name: 'maestro-scheduler',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  // api.imply('percolate:synced-cron@1.3.0');
  api.use('percolate:synced-cron@1.3.0');

  const requiredPackages = [
      'maestro-base',
      'maestro-users'
  ];

  api.use(requiredPackages);
  api.imply(requiredPackages);

  api.addFiles('lib/server/maestro-reminders.js', 'server');

  api.addFiles('lib/scheduler.js', 'server');
  api.addFiles('maestro-scheduler.js');
  api.addFiles([
    'maestro-synced-cron.js',
      'methods/methods.js',
    'startup.js'
  ], ['server']);

  api.use('maestro-notifications', ['server']);

  api.addFiles('model/reminders.js');
  api.export('Reminders');

  api.addFiles('remindersPublications.js', 'server');
  api.addFiles('remindersSubscriptions.js', 'client');
  
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('maestro-scheduler');
  api.addFiles('maestro-scheduler-tests.js');
});
