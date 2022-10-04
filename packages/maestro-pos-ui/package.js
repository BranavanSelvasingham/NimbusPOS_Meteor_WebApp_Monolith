Package.describe({
    name: 'maestro-pos-ui',
    version: '0.0.1',
    // Brief, one-line summary of the package.
    summary: '',
    // URL to the Git repository containing the source code for this package.
    git: '',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Package.onUse(function (api) {
    var both = ['client', 'server'];
    var server = 'server';
    var client = 'client';
    var browserOnly = "web.browser";
    var cordovaOnly = "web.cordova";

    api.versionsFrom('1.2.1');

    const requiredPackages = [
      'maestro-base',
      'maestro-users',
    ];

    api.use('d3js:d3',[client]);
    api.imply('d3js:d3',[client]);

    api.use(requiredPackages);
    api.imply(requiredPackages);

    api.use(['ecmascript', 'underscore', 'mongo'], both);
    api.use(['templating', 'session', 'jquery'], client);

    api.addFiles([
        'styles/svgStyles.css',   
    ], client);

    api.addFiles([
        'floorLayout/createTable.html',
        'floorLayout/createTable.js',
        'floorLayout/layoutEditor.html',
        'floorLayout/layoutEditor.js',     
    ], client);

    api.addFiles([
        'views/home.html',
        'views/home.js',
        'views/orderHistory.html',
        'views/orderHistory.js',
        'views/openOrders.html',
        'views/openOrders.js',
        'views/reportsHome.html',
        'views/reportsHome.js',
        'views/posMenu.html',
        'views/posMenu.js',
        'views/posAdminMenuSettings.html',
        'views/posAdminMenuSettings.js',
        'views/tipsTrackSettings.html',
        'views/tipsTrackSettings.js',
        'views/restaurant/restaurantView.html',
        'views/restaurant/restaurantView.js',     
    ], client);

    // api.addFiles([
    //     'views/unused/createOrder.html',
    //     'views/unused/createOrder.js',
    //     'views/unused/createOrderSlides.html',
    //     'views/unused/createOrderSlides.js',
    //     'views/unused/createOrderGrid.html',
    //     'views/unused/createOrderGrid.js',
    //     'views/unused/createOrderGridReact.js',
    //     'views/unused/createOrderList.html',
    //     'views/unused/createOrderList.js',
    //     'views/unused/createOrderTiles.html',
    //     'views/unused/createOrderTiles.js',
    //     'views/unused/toolbar.html',
    //     'views/unused/toolbar.js',
    //     'views/unused/createOrderTable.html',
    //     'views/unused/createOrderTable.js',
    // ], client);

    api.addFiles('ordersSubscriptions.js', client);

});

/*
Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('maestro-pos');
    api.addFiles('maestro-pos-tests.js');
});
*/
