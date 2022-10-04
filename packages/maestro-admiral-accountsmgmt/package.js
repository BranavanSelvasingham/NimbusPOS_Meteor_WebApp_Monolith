Package.describe({
  name: 'maestro-admiral-accountsmgmt',
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
  api.mainModule('maestro-admiral-accountsmgmt.js');

  api.use([
    'ecmascript',
    'momentjs:moment',
    'meteorhacks:aggregate@1.3.0',
    'mdg:validated-method',
    'maestro-pos-core',
    'maestro-atlas',
    'maestro-accountinfo',
  ]);

  api.use(['underscore', 'templating', 'session', 'jquery'], ['web.browser', 'web.cordova']);

  api.addFiles('views/invoiceManagement.html', 'web.browser');
  api.addFiles('views/invoiceManagement.js', 'web.browser');

  api.addFiles('model/invoices-enableEditing.js');
  api.addFiles('model/invoices-admiralPublications.js', 'server');

  api.addFiles('lib/client/admiral-invoice.js', 'web.browser');

});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('maestro-admiral-accountsmgmt');
  api.mainModule('maestro-admiral-accountsmgmt-tests.js');
});
