Package.describe({
  name: 'maestro-help',
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

  api.use(['underscore', 'templating', 'session', 'jquery'], 'client');

  api.addFiles('maestro-help.js');

  api.use(['maestro-base', 'maestro-business-base-core'], ['client', 'server']);
  api.imply('maestro-base', ['client', 'server']);

  api.addFiles('lib/server/maestro-contactMaestro.js', 'server');
  api.addFiles('methods/helpMethods.js', 'server');

  api.addFiles('views/generalHelp.html', 'client');
  api.addFiles('views/generalHelp.js', 'client');

  api.add_files('views/suggestImprovements.html', 'client');
  api.add_files('views/suggestImprovements.js', 'client');

  api.add_files('views/appInfo.html', 'client');
  api.add_files('views/appInfo.js', 'client');

});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('maestro-help');
  api.addFiles('maestro-help-tests.js');
});
