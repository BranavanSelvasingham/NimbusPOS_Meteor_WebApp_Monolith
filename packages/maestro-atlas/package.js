Package.describe({
  name: 'maestro-atlas',
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
    'meteorhacks:aggregate',
    'mdg:validated-method',
    'maestro-pos-core'
  ]);

  api.use('d3js:d3',['client']);
  api.imply('d3js:d3',['client']);

  api.use(['underscore', 'templating', 'session', 'jquery'], ['client', 'web.cordova']);

  api.imply('maestro-base', ['client', 'web.cordova', 'server']);
  api.use('maestro-base', ['client', 'web.cordova', 'server']);

  api.addFiles('lib/atlas.js', ['client', 'web.cordova', 'server']);
  api.addFiles(['lib/tally.js', 'lib/aggregates.js'], ['client', 'web.cordova']);

  api.addFiles('lib/server/maestro-dashboard.js', 'server');
  api.addFiles('server/order-aggregates.js', 'server');
  api.addFiles('server/order-aggregates-accounting.js', 'server');
  api.addFiles('lib/atlas-methods.js');

  api.addFiles('styles/atlas.css', 'client');

  api.addFiles('maestro-atlas.js', 'client');

  api.addFiles('views/simpleBarAndPie.html', 'client');
  api.addFiles('views/simpleBarAndPie.js', 'client');
  api.addFiles('views/simpleBarAndPie.css', 'client');
  api.addFiles('views/barChart.js', 'client');

  api.addFiles('views/dashboardHome.html', 'client');
  api.addFiles('views/dashboardHome.js', 'client');

  // api.addFiles('views/archived/timelineSelect.html', 'client');
  // api.addFiles('views/archived/timelineSelect.js', 'client');

  // api.addFiles('views/archived/dailyView.html', 'client');
  // api.addFiles('views/archived/dailyView.js', 'client');

  // api.addFiles('views/archived/weeklyView.html', 'client');
  // api.addFiles('views/archived/weeklyView.js','client');

  // api.addFiles('views/archived/biweeklyView.html', 'client');
  // api.addFiles('views/archived/biweeklyView.js','client');

  // api.addFiles('views/archived/monthlyView.html', 'client');
  // api.addFiles('views/archived/monthlyView.js','client');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('maestro-atlas');
  api.addFiles('maestro-atlas-tests.js');
});
