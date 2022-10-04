//browser-policy settings
BrowserPolicy.framing.disallow();
BrowserPolicy.content.disallowInlineScripts();
BrowserPolicy.content.disallowEval();
BrowserPolicy.content.allowInlineStyles();
BrowserPolicy.content.allowFontDataUrl();

BrowserPolicy.content.allowOriginForAll("https://js.stripe.com/");
BrowserPolicy.content.allowOriginForAll("https://checkout.stripe.com/");
BrowserPolicy.content.allowOriginForAll("*.stripe.com/");
BrowserPolicy.content.allowOriginForAll("http://www.google-analytics.com/");

// BrowserPolicy.content.allowConnectOrigin("69.165.233:169:*");