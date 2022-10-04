Package.describe({
  name: 'maestro-accounting-ui',
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
  api.versionsFrom('1.3.2.4');
  api.use('ecmascript');
  api.mainModule('maestro-accounting-ui.js');

  api.use(['underscore', 'templating', 'session', 'jquery'], ['client']);

  const requiredPackages = [
      'maestro-base',
      'maestro-users',
      'maestro-atlas'
  ];

  api.use(requiredPackages);
  api.imply(requiredPackages);

  api.addFiles('views/accountingMain.html', 'client');
  api.addFiles('views/accountingMain.js', 'client');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('maestro-accounting-ui');
  api.mainModule('maestro-accounting-ui-tests.js');
});
