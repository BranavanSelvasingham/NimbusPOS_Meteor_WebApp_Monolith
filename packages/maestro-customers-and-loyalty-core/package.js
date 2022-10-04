Package.describe({
  name: 'maestro-customers-and-loyalty-core',
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
  api.addFiles('maestro-customers-and-loyalty-core.js');

  api.use(['underscore', 'templating', 'session', 'jquery'], 'client');
  api.use('underscore', 'server');

  api.imply('maestro-base', ['client', 'server']);
  api.use(['maestro-base', 'maestro-business-base-core'], ['client', 'server']);

  api.imply('maestro-products-core', ['client', 'server']);
  api.use('maestro-products-core', ['client', 'server']);

  api.addFiles('methods/customers.js');
  api.addFiles('methods/loyalty-programs.js');

  api.addFiles('lib/maestro-customers.js');
  api.addFiles('lib/maestro-loyalty.js');
  api.addFiles('lib/maestro-loyaltyCards.js');

  api.addFiles('model/customers.js');
  api.addFiles('model/customers-publications.js', 'server');
  api.export('Customers');

  api.addFiles('model/loyalty-programs.js');
  api.addFiles('model/loyalty-programs-publications.js', 'server');
  api.export('LoyaltyPrograms');

  api.addFiles('model/loyalty-cards.js');
  api.addFiles('model/loyalty-cards-publications.js', 'server');
  api.export('LoyaltyCards');

});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('maestro-customers-and-loyalty-core');
  api.addFiles('maestro-customers-and-loyalty-core-tests.js');
});
