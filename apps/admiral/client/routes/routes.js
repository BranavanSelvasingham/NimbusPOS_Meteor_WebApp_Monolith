Maestro.Client.AllRoutes = [
    {
        path: "/",
        name: "Root",
        action: Maestro.Client.goToUserHome
    },
    {
        path: "/home",
        name: "Home",
        action: Maestro.Client.goToUserHome
    },
    // {
    //     path: "/posmenu",
    //     name: "PosMenu",
    //     template: Maestro.Templates.POSMenu
    // },
    // {
    //     path: "/signup",
    //     name: "Signup",
    //     // menu: "Sign Up",
    //     template: Maestro.Templates.CreateBusiness
    // },
    // {
    //     path: "/login",
    //     name: "Login",
    //     // menu: "Login",
    //     template: Maestro.Templates.Login
    // },
    // {
    //     path: "/admin",
    //     name: "Admin",
    //     template: Maestro.Templates.AdminDashboard
    // },
    // {
    //     path: "/selectBusiness",
    //     name: "SelectBusiness",
    //     template: Maestro.Templates.ListBusinesses 
    // },
    {
        path: "/allBusinesses",
        name: "All Business",
        menu: "All Businesses",
        template: Maestro.Templates.AllBusinesses,
    },
    {
        path: "/allUsers",
        name: "All Users",
        menu: "All Users",
        template: Maestro.Templates.AllUsers,
    },
    {
        path: "/Dashboards",
        name: "Dashboards",
        menu: "Dashboards",
        template: Maestro.Templates.AdmiralDashboard,  
    },
    {
        path: "/Invoices",
        name: "Invoices",
        menu: "Invoices",
        template: Maestro.Templates.InvoiceManagement,  
    },
    {
        path: "/supportConversations",
        name: "SupportChat",
        menu: "Support Chat",
        template: Maestro.Templates.AllSupportConversations,  
    },
    {
        path: "/allCustomers",
        name: "AllCustomers",
        menu: "All Customers",
        template: Maestro.Templates.AllCustomers,  
    },
    
    // {
    //     path: "/products",
    //     name: "Products",
    //     menu: "Products",
    //     template: Maestro.Templates.ManageProductsHome,
    //     subroutes: [
    //         {
    //             path: "/create",
    //             name: "CreateProduct",
    //             template: Maestro.Templates.CreateProduct
    //         },
    //         {
    //             path: "/sizes",
    //             name: "ProductSizes",
    //             // menu: "Sizes",
    //             template: Maestro.Templates.ManageProductsHome
    //         },
    //         {
    //             path: "/categories",
    //             name: "ProductCategories",
    //             // menu: "Categories",
    //             template: Maestro.Templates.ManageProductsHome
    //         },
    //         {
    //             path: "/addons",
    //             name: "ManageAddons",
    //             // menu: "Add-Ons",
    //             template: Maestro.Templates.ManageProductsHome
    //         }
    //     ]
    // },
    // {
    //     path: "/loyaltyPrograms",
    //     name: "ListLoyaltyPrograms",
    //     menu: "Loyalty",
    //     template: Maestro.Templates.ListLoyaltyPrograms,
    //     subroutes: [
    //             {
    //             path: "/create",
    //             name: "CreateLoyaltyProgram",
    //             template: Maestro.Templates.CreateLoyaltyProgram
    //             }
    //         ]
    // },
    // {
    //     path: "/orders",
    //     name: "Orders",
    //     menu: "Orders",
    //     template: Maestro.Templates.OrdersHome,
    //     subroutes: [
    //         {
    //             path: "/history",
    //             name: "OrderHistory",
    //             menu: "History",
    //             template: Maestro.Templates.OrderHistory
    //         },
    //         {
    //             path: "/reports",
    //             name: "Reports",
    //             menu: "Reports",
    //             template: Maestro.Templates.ReportsHome
    //         }
    //     ]
    // },
    // {
    //     path: "/ex",
    //     name: "External",
    //     template: Maestro.Templates.External,
    //     subroutes: [
    //         {
    //             path: "/enterHours",
    //             name: "EnterHours",
    //             template: Maestro.Templates.EnterHours
    //         }
    //     ]
    // },
    // {
    //     path: "/help",
    //     name:"HelpAndFeedback",
    //     menu: "Help",
    //     template: Maestro.Templates.GeneralHelp,
    //     subroutes: [
    //         {
    //             path: "/suggestImprovements",
    //             name: "SuggestImprovements",
    //             menu: "Request Features",
    //             template: Maestro.Templates.SuggestImprovements
    //         }
    //     ]
    // },
    // {
    //     path: "/settings",
    //     name: "Settings",
    //     menu: "Settings",
    //     template: Maestro.Templates.SettingsHome
    // },
    // {
    //     path: "/logout",
    //     name: "Logout",
    //     menu: "Logout",
    //     action: Maestro.Users.logoutUser
    // },
];

