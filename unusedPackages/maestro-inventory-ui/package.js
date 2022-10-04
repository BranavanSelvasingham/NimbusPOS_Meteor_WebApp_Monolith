Package.describe({
  name: 'maestro-inventory-ui',
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
  api.mainModule('maestro-inventory-ui.js');

  api.use(['underscore', 'templating', 'session', 'jquery'], ['client']);

  const requiredPackages = [
      'maestro-base',
      'maestro-users'
  ];

  api.use(requiredPackages);
  api.imply(requiredPackages);

  api.addFiles('invoicesSubscriptions.js', 'client');

  api.addFiles('views/manageInventory.html', 'client');
  api.addFiles('views/manageInventory.js', 'client');

});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('maestro-inventory-ui');
  api.mainModule('maestro-inventory-ui-tests.js');
});
