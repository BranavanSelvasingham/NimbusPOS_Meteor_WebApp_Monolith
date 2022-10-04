Maestro = {
    Templates: {},
    Schemas: {},
    Collections: new Map(),
    CollectionsHooks: {},
    Methods: new Map(),
    UtilityMethods : {},
    Users: {},
    Business: {},
    route: {},
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
        POS_DEFAULT_PAYMENT_METHOD: "pos-default-payment-method",
        POS_ALWAYS_PRINT_RECEIPT: "pos-always-print-receipt",
        POS_ALWAYS_PRIOR_ORDER_SUMMARY: "pos-always-prior-order-summary",
        CUSTOMER_SEARCH_TYPE: "customer-search-type",
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

if(Meteor.isServer) {
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


Maestro.UtilityMethods.ConvertDateToUTCConstant = function(localDate){
    return Date.UTC(localDate.getUTCFullYear(), localDate.getUTCMonth(), localDate.getUTCDate(), localDate.getUTCHours(), localDate.getUTCMinutes(), localDate.getUTCSeconds());
};