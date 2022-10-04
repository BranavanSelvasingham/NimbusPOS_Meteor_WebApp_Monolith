Package.describe({
  name: 'maestro-business-base-ui',
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

  api.use([
    'ecmascript',
    'templating',
    'mongo',
    'underscore',
    'session',
    'jquery',
    'session',
    'amplify',
    'http',
    'materializecss',
    'maestro-business-base-core',
    'maestro-atlas'
  ], client);

  api.addFiles([
      'views/createBusiness.html',
      'views/createBusiness.js',
      'views/createNewAccount.html',
      'views/createNewAccount.js',
      'views/listBusinesses.html',
      'views/listBusinesses.js',
      'views/businessDashboard.html',
      'views/businessDashboard.js',

      //business locations
      'views/locations/addLocation.html',
      'views/locations/addLocation.js',
      'views/locations/listLocations.html',
      'views/locations/listLocations.js',
      'views/locations/locationDetails.html',
      'views/locations/locationDetails.js',
      'views/locations/posPrinterSettings.html',
      'views/locations/posPrinterSettings.js',

      //business users
      'views/users/addBusinessUser.html',
      'views/users/addBusinessUser.js',
      'views/users/listBusinessUsers.html',
      'views/users/listBusinessUsers.js',
      'views/users/businessUserDetails.html',
      'views/users/businessUserDetails.js',
      'views/users/businessUsersHome.html',
      'views/users/businessUsersHome.js',

      //business configuration
      'views/configuration/businessConfiguration.html',
      'views/configuration/businessConfiguration.js',
      'views/configuration/manageDevices.html',
      'views/configuration/manageDevices.js',
      'views/configuration/primaryContactEmail.html',
      'views/configuration/primaryContactEmail.js',

      //admiral views
      'views/admiralViews/admiralBusinesses.html',
      'views/admiralViews/admiralBusinesses.js',

  ], client);
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('maestro-business-base-ui');
});
