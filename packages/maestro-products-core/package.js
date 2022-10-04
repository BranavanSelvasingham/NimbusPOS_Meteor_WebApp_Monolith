Package.describe({
  name: 'maestro-products-core',
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
  api.use('underscore', 'server');

  api.imply('maestro-base', ['client', 'server']);
  api.use(['maestro-base', 'maestro-business-base-core'], ['client', 'server']);

  api.addFiles('methods/productMethods.js');

  api.addFiles('lib/maestro-products.js', ['client', 'server']);

  api.addFiles('lib/client/maestro-client-products.js', 'client');
  api.addFiles('lib/client/templatesProducts.js', 'client');

  api.addFiles('model/products.js');
  api.addFiles('model/product-addons.js');
  api.addFiles('model/product-categories.js');
  api.export(['ProductAddons', 'ProductCategories', 'Products']);

  api.addFiles('maestro-products-core.js', 'server');
  api.addFiles('productsPublications.js', 'server');

});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('maestro-products-core');
  api.addFiles('maestro-products-core-tests.js');
});
