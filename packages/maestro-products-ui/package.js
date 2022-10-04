Package.describe({
  name: 'maestro-products-ui',
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

  api.use(['underscore', 'templating', 'session', 'jquery'], ['client']);

  const requiredPackages = [
      'maestro-base',
      'maestro-users'
  ];

  api.use(requiredPackages);
  api.imply(requiredPackages);

  api.addFiles('productsSubscriptions.js', 'client');

  api.addFiles('views/manageAddons.html', 'client');
  api.addFiles('views/manageAddons.js', 'client');

  api.addFiles('views/manageCategory.html', 'client');
  api.addFiles('views/manageCategory.js', 'client');

  api.addFiles('views/ManageProductsHome.html', 'client');
  api.addFiles('views/ManageProductsHome.js', 'client');

  api.addFiles('views/productsMenuView.html', 'client');
  api.addFiles('views/productsMenuView.js', 'client');

  api.addFiles('views/manageSizes.html', 'client');
  api.addFiles('views/manageSizes.js', 'client');

  api.addFiles('views/posAddOnCreationSettings.html', 'client'); 
  api.addFiles('views/posAddOnCreationSettings.js', 'client');


});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('maestro-products-ui');
  api.addFiles('maestro-products-ui-tests.js');
});
