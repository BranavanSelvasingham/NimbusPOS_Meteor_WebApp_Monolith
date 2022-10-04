Package.describe({
    name: 'materializecss',
    version: '0.97.5-alpha1',
    // Brief, one-line summary of the package.
    summary: '',
    // URL to the Git repository containing the source code for this package.
    git: '',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('1.2.1');
    api.use('ecmascript');
    api.use('fourseven:scss@3.4.1');
    api.imply('fourseven:scss@3.4.1');

    api.export('Materialize');

    api.addAssets([
        'font/material-design-icons/Material-Design-Icons.eot',
        'font/material-design-icons/Material-Design-Icons.svg',
        'font/material-design-icons/Material-Design-Icons.ttf',
        'font/material-design-icons/Material-Design-Icons.woff',
        'font/material-design-icons/Material-Design-Icons.woff2',
        'font/roboto/Roboto-Bold.eot',
        'font/roboto/Roboto-Bold.ttf',
        'font/roboto/Roboto-Bold.woff',
        'font/roboto/Roboto-Bold.woff2',
        'font/roboto/Roboto-Light.eot',
        'font/roboto/Roboto-Light.ttf',
        'font/roboto/Roboto-Light.woff',
        'font/roboto/Roboto-Light.woff2',
        'font/roboto/Roboto-Medium.eot',
        'font/roboto/Roboto-Medium.ttf',
        'font/roboto/Roboto-Medium.woff',
        'font/roboto/Roboto-Medium.woff2',
        'font/roboto/Roboto-Regular.eot',
        'font/roboto/Roboto-Regular.ttf',
        'font/roboto/Roboto-Regular.woff',
        'font/roboto/Roboto-Regular.woff2',
        'font/roboto/Roboto-Thin.eot',
        'font/roboto/Roboto-Thin.ttf',
        'font/roboto/Roboto-Thin.woff',
        'font/roboto/Roboto-Thin.woff2'
    ], 'client');

    api.addFiles([
        'js/hammer.min.js',
        'js/jquery.easing.1.3.js',
        'js/jquery.hammer.js',
        'js/velocity.min.js',
        'js/global.js',
        'js/animation.js',
        'js/buttons.js',
        'js/cards.js',
        'js/carousel.js',
        'js/character_counter.js',
        'js/chips.js',
        'js/collapsible.js',
        'js/dropdown.js',
        'js/forms.js',
        'js/leanModal.js',
        'js/materialbox.js',
        'js/parallax.js',
        'js/pushpin.js',
        'js/scrollFire.js',
        'js/scrollspy.js',
        'js/sideNav.js',
        'js/slider.js',
        'js/tabs.js',
        'js/toasts.js',
        'js/tooltip.js',
        'js/transitions.js',
        'js/waves.js',
        'js/date_picker/picker.js',
        'js/date_picker/picker.date.js'
    ], 'client');

    api.addFiles([
        'sass/components/_prefixer.scss',
        'sass/components/_mixins.scss',
        'sass/components/_color.scss',

        'sass/_overrides_pre.scss', //ABLABS Custom
        'sass/components/_variables.scss',

        'sass/components/_normalize.scss',
        'sass/components/_global.scss',

        'sass/components/_buttons.scss',
        'sass/components/_cards.scss',
        'sass/components/_carousel.scss',
        'sass/components/_chips.scss',
        'sass/components/_collapsible.scss',
        'sass/components/_dropdown.scss',
        'sass/components/_form.scss',
        'sass/components/_grid.scss',
        'sass/components/_icons-material-design.scss',
        'sass/components/_materialbox.scss',
        'sass/components/_modal.scss',
        'sass/components/_navbar.scss',
        'sass/components/_preloader.scss',
        'sass/components/_roboto.scss',
        'sass/components/_sideNav.scss',
        'sass/components/_slider.scss',
        'sass/components/_carousel.scss',
        'sass/components/_table_of_contents.scss',
        'sass/components/_tabs.scss',
        'sass/components/_toast.scss',
        'sass/components/_tooltip.scss',
        'sass/components/_typography.scss',
        'sass/components/_waves.scss',
        'sass/components/date_picker/_default.scss',
        'sass/components/date_picker/_default.date.scss',
        'sass/components/date_picker/_default.time.scss',

        'sass/_overrides_post.scss', //ABLABS Custom
        'sass/materialize.scss'

    ], 'client');


});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('materializecss');
    api.addFiles('materializecss-tests.js');
});
