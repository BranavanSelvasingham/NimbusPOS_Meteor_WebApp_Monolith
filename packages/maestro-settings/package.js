Package.describe({
  name: 'maestro-settings',
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
  api.addFiles('maestro-settings.js');

  api.use(['underscore', 'templating', 'session', 'jquery'], 'client');

  api.use('maestro-base', ['client']);
  api.imply('maestro-base', ['client']);

  api.addFiles('views/settingsHome.html', 'client');
  api.addFiles('views/settingsHome.js', 'client');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('maestro-settings');
  api.addFiles('maestro-settings-tests.js');
});
