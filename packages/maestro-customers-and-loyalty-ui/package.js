Package.describe({
  name: 'maestro-customers-and-loyalty-ui',
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
  api.addFiles('maestro-customers-and-loyalty-ui.js');

  api.use(['underscore', 'templating', 'session', 'jquery'], ['client']);

  const requiredPackages = [
      'maestro-base',
      'maestro-users'
  ];

  api.use(requiredPackages);
  api.imply(requiredPackages);

  api.addFiles([
    'views/createCustomer.html',
    'views/createCustomer.js',
    'views/listCustomers.html',
    'views/listCustomers.js',
    'views/loyalty-programs/createLoyaltyProgram.html',
    'views/loyalty-programs/createLoyaltyProgram.js',
    'views/loyalty-programs/listLoyaltyPrograms.html',
    'views/loyalty-programs/listLoyaltyPrograms.js'], 'client');

  api.addFiles('customers-subscriptions.js', 'client');
  api.addFiles('loyalty-programs-subscriptions.js', 'client');
  api.addFiles('loyalty-cards-subscriptions.js', 'client');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('maestro-customers-and-loyalty-ui');
  api.addFiles('maestro-customers-and-loyalty-ui-tests.js');
});
