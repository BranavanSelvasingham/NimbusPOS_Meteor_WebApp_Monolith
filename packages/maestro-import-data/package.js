Package.describe({
  name: 'maestro-import-data',
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
  api.addFiles('maestro-import-data.js');

  api.use('d3js:d3',['web.cordova']);
  api.imply('d3js:d3',['web.cordova']);

  api.use(['underscore', 'templating', 'session', 'jquery'], 'web.cordova');

  api.imply('maestro-base', 'web.cordova');
  api.use('maestro-base', 'web.cordova');

  api.addFiles('lib/PapaParse-4.1.2/papaparse.js');

  api.addFiles('lib/importData.js', 'web.cordova');

  api.addFiles('import/csvImport.js', 'web.cordova');

  api.addAssets('downloads/products.csv', 'web.cordova');

  api.addFiles('views/importFile.html', 'web.cordova');
  api.addFiles('views/importFile.js', 'web.cordova');

});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('maestro-import-data');
  api.addFiles('maestro-import-data-tests.js');
});
