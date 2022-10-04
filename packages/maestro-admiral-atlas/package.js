Package.describe({
  name: 'maestro-admiral-atlas',
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
  api.use([
    'ecmascript',
    'momentjs:moment',
    'meteorhacks:aggregate@1.3.0',
    'mdg:validated-method',
    'maestro-pos-core',
    'maestro-atlas'
  ]);

  api.use('d3js:d3',['web.browser']);
  api.imply('d3js:d3',['web.browser']);

  api.use(['underscore', 'templating', 'session', 'jquery'], ['web.browser', 'web.cordova']);


  api.addFiles('views/admiralDashboard.html', 'web.browser');
  api.addFiles('views/admiralDashboard.js', 'web.browser');

});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('maestro-admiral-atlas');
  api.addFiles('maestro-admiral-atlas-tests.js');
});
