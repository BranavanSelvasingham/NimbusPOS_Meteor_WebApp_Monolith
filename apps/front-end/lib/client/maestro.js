Maestro = {
    Templates: {},
    Schemas: {},
    Collections: new Map(),
    CollectionsHooks: {},
    Methods: new Map(),
    UtilityMethods : {},
    Users: {},
    Business: {},
    UserSessionConstants: {
        BUSINESS_ID: "bid",
        BUSINESS_NAME: "sbn",
        LOCATION_ID: "lid",
        LOCATION_NAME: "sln",
        LOCAL_APP_ID: "local-app-id",
        ORDERS_VIEW_TYPE: "order-view-type",
        SELECT_EMPLOYEE: "select-employee",
        WAITER_LOCK: "waiter-lock",
        POS_START_ORDER_TYPE: "pos-start-order-type",
    }
};

if(Meteor.isClient) {
    Maestro.Client = {
        startupHooks: new Set(),

        onStartup: function(fn) {
            if(fn && typeof fn === 'function') {
                Maestro.Client.startupHooks.add(fn);
            }
        },

        toggleValidationClass: function(elementSelector, isValid) {
            $(elementSelector)
                .removeClass("invalid")
                .removeClass("valid")
                .addClass(isValid ? "valid" : "invalid");
        }
    };
}

if(Maestro.isServer) {
    Maestro.Server = {};
}

Maestro.Contact = {};

Maestro.Products = {};


// Replaced by Maestro.Products.Categories.Colors
Maestro.Colors = [
    "wet-asphalt",
    "midnight-blue",
    "concrete",
    "asbestors",
    "belize-hole",
    "peter-river",
    "amethyst",
    "turquoise",
    "green-sea",
    "nephritis",
    "sun-flower",
    "pumpkin",
    "orange",
    "clouds"
];

Maestro.roles = {
    ADMIN: "admin",
    CUSTOMER: "customer",
    BUSINESS_ADMIN: "business-admin",
    LOCATION_ADMIN: "location-admin",
    BUSINESS_USER: "business-user",
    BUSINESS_CUSTOMER: "business-customer",
    BUSINESS_ACCOUNTANT: "business-accountant"
};
