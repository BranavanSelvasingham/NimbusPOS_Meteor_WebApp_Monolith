App.info({
    id: 'test.nimbuspos.register',
    name: 'nimbus test',
    description: 'Intuitive and fun POS.',
    version: "0.9.0",
    author: 'Nimbus POS Inc.',
    email: 'info@nimbuspos.com',
    website: 'https://test.nimbuspos.com'
});

// Set up resources such as icons and launch screens.
App.icons({
    //'iphone': 'icons/icon-60.png',
    //'iphone_2x': 'icons/icon-60@2x.png',
    // ... more screen sizes and platforms ...
});

App.launchScreens({
    //'iphone': 'splash/Default~iphone.png',
    //'iphone_2x': 'splash/Default@2x~iphone.png',
    // ... more screen sizes and platforms ...
});

// Set PhoneGap/Cordova preferences
App.setPreference('BackgroundColor', '0xffffffff');
App.setPreference('HideKeyboardFormAccessoryBar', true);
App.setPreference('Fullscreen', true);
//App.setPreference('StatusBarOverlaysWebView', true);
//App.setPreference('StatusBarStyle', 'blacktranslucent');
App.setPreference('DisallowOverscroll', true);
App.setPreference('EnableWebGL', true);
App.setPreference('KeepRunning', true); //todo check if needed
// App.setPreference('Orientation', 'sensorLandscape');
// App.setPreference('Orientation', 'landscape', 'ios');

// Not needed after the https and server url fix
// App.accessRule('*');
App.accessRule('https://enginex.kadira.io');


App.icons({
  // iOS
  // 'iphone': 'resources/icons/icon-60x60.png',
  // 'iphone_2x': 'resources/icons/icon-60x60@2x.png',
  // 'iphone_3x': 'resources/icons/icon-60x60@3x.png',
  // 'ipad': 'resources/icons/icon-76x76.png',
  // 'ipad_2x': 'resources/icons/icon-76x76@2x.png',

  // Android
  // 'android_ldpi': 'resources/icons/icon-36x36.png',
  'android_mdpi': 'resources/icons/icon-48x48.png',
  'android_hdpi': 'resources/icons/icon-72x72.png',
  'android_xhdpi': 'resources/icons/icon-96x96.png'
});

App.launchScreens({
  // iOS
  // 'iphone': 'resources/splash/splash-320x480.png',
  // 'iphone_2x': 'resources/splash/splash-320x480@2x.png',
  // 'iphone5': 'resources/splash/splash-320x568@2x.png',
  // 'iphone6': 'resources/splash/splash-375x667@2x.png',
  // 'iphone6p_portrait': 'resources/splash/splash-414x736@3x.png',
  // 'iphone6p_landscape': 'resources/splash/splash-736x414@3x.png',

  // 'ipad_portrait': 'resources/splash/splash-768x1024.png',
  // 'ipad_portrait_2x': 'resources/splash/splash-768x1024@2x.png',
  // 'ipad_landscape': 'resources/splash/splash-1024x768.png',
  // 'ipad_landscape_2x': 'resources/splash/splash-1024x768@2x.png',

  // Android
  // 'android_ldpi_portrait': 'resources/splash/splash-200x320.png',
  // 'android_ldpi_landscape': 'resources/splash/splash-320x200.png',
  // 'android_mdpi_portrait': 'resources/splash/splash-720x1280.png',
  // 'android_mdpi_landscape': 'resources/splash/splash-470x320.png',
  // // 'android_hdpi_portrait': 'resources/splash/splash-720x1280.png',
  // 'android_hdpi_landscape': 'resources/splash/splash-640x480.png',
  // // 'android_xhdpi_portrait': 'resources/splash/splash-720x1280.png',
  // 'android_xhdpi_landscape': 'resources/splash/splash-960x720.png',
  // 'android_xxhdpi_landscape': 'resources/splash/splash-1440x1080.png'

  'android_mdpi_landscape': 'resources/splash/drawable-mdpi/splash_960x720.9.png',
  // 'android_hdpi_portrait': 'resources/splash/splash-720x1280.png',
  'android_hdpi_landscape': 'resources/splash/drawable-hdpi/splash_960x720.9.png',
  // 'android_xhdpi_portrait': 'resources/splash/splash-720x1280.png',
  'android_xhdpi_landscape': 'resources/splash/drawable-xhdpi/splash_960x720.9.png',
  'android_xxhdpi_landscape': 'resources/splash/drawable-xxhdpi/splash_960x720.9.png'
});