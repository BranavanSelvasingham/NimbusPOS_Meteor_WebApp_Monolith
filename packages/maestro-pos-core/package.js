Package.describe({
  name: 'maestro-pos-core',
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
    var both = ['client', 'server'];
    var server = 'server';
    var client = 'client';

    api.versionsFrom('1.2.1');

    api.use('maestro-base', both);
    api.imply('maestro-base', both);

    api.use('maestro-products-core', both);
    api.imply('maestro-products-core', both);

    api.use(['ecmascript', 'underscore', 'mongo'], both);
    api.use(['templating', 'session', 'jquery'], client);

    api.addFiles('model/orders.js');
    api.export('Orders');

    api.addFiles('model/tables.js');
    api.export('Tables');

    api.addFiles('model/ordersPublications.js', server);
    api.addFiles('model/tablesPublications.js', server);

    api.addFiles('lib/client/maestro-order.js', client);
    api.addFiles('lib/client/maestro-reports.js', client);
    api.addFiles('lib/client/maestro-tables.js', client);
    api.addFiles('lib/client/maestro-pos.js', client);
    api.addFiles('lib/server/maestro-contactCustomer.js', server);

    api.addFiles('methods/posMethods.js', server);
    
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('maestro-pos-core');
  api.addFiles('maestro-pos-core-tests.js');
});
