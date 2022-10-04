Package.describe({
  name: 'maestro-loyalty',
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
  // api.mainModule('maestro-loyalty.js');

  api.use(['underscore', 'templating', 'session', 'jquery'], 'client');
  api.use('underscore', 'server');

  api.imply('maestro-base', ['client', 'server']);
  api.use(['maestro-base', 'maestro-business-base-core'], ['client', 'server']);

  api.imply('maestro-products-core', ['client', 'server']);
  api.use('maestro-products-core', ['client', 'server']);

  // api.addFiles('lib/test.js');
  // api.addFiles('lib/maestro-loyaltyCards.js');
  // api.addFiles('model/loyaltyCards.js');
  // api.addFiles('model/publications.js','server');
  api.addFiles('model/migrations/loyaltyCardsMigrations.js', 'client');

  // api.export('LoyaltyCards');
  
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('maestro-loyalty');
  api.mainModule('maestro-loyalty-tests.js');
});
