Maestro.Client.PosRoutes = [
// Maestro.Client.AllRoutes = [
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
    {
        path: "/signup",
        name: "Signup",
        // menu: "Sign Up",
        template: Maestro.Templates.CreateNewAccount
    },
    {
        path: "/login",
        name: "Login",
        // menu: "Login",
        template: Maestro.Templates.Login
    },
    {
        path: "/waiterLogin",
        name: "WaiterLogin",
        template: Maestro.Templates.WaiterLogin
    },
    {
        path: "/posmenu",
        name: "PosMenu",
        menu: "POSMenu",
        template: Maestro.Templates.POSMenu
    },
    {
        path: "/orders",
        name: "Orders",
        menu: "Orders",
        access: "GENERAL",
        icon: "add_shopping_cart",
        template: Maestro.Templates.OrdersHome,
        subroutes: [
                    {
                        path: "/edit/:orderId/:checkoutMode",
                        name: "EditOrder",
                        template: Maestro.Templates.OrdersHome
                    },
                ]
    },
    {
        path: "/orders/history",
        name: "OrderHistory",
        menu: "History",
        access: "GENERAL",
        icon: "history",
        template: Maestro.Templates.OrderHistory,
        subroutes: [
                    {
                        path: "/select/:orderId",
                        name: "ViewOrderHistory",
                        template: Maestro.Templates.OrderHistory,
                    },
                ]
    },
    {
        path: "/orders/openOrders",
        name: "OpenOrders",
        menu: "Open Orders",
        access: "GENERAL",
        icon: "content_paste",
        template: Maestro.Templates.OpenOrders,
        subroutes: [
                    {
                        path: "/select/:orderId",
                        name: "ViewOpenOrders",
                        template: Maestro.Templates.OpenOrders,
                    },
                ]
    },
    {
        path: "/reports",
        name: "Reports",
        menu: "Reports",
        access: "GENERAL",
        icon: "description",
        template: Maestro.Templates.ReportsHome
    },
    {
        path: "/business/employees/enterEmployeeHours",
        name: "EnterHours",
        menu: "Hours",
        access: "GENERAL",
        icon: "access_time",
        template: Maestro.Templates.EnterEmployeeHours
    },
    {
        path: "/business/expenses/create",
        name: "EnterExpense",
        menu: "Expenses",
        access: "GENERAL",
        icon: "event_note",
        template: Maestro.Templates.CreateExpense
    },
    {
        path: "/notebook",
        name: "Notes",
        menu: "Notes",
        access: "GENERAL",
        icon: "library_books",
        template: Maestro.Templates.NoteBook,
        subroutes: [
            {
                path: "/createNote",
                name: "createNote",
                template: Maestro.Templates.CreateNote
            }
        ]
    },
    {
        path: "/help",
        name:"HelpAndFeedback",
        menu: "Help",
        access: "GENERAL",
        icon: "help_outline",
        template: Maestro.Templates.GeneralHelp,
        subroutes: [
            {
                path: "/suggestImprovements",
                name: "SuggestImprovements",
                menu: "Request Features",
                template: Maestro.Templates.SuggestImprovements
            }
        ]
    },
    // {
    //     path: "/openTill",
    //     name: "Till",
    //     access: "GENERAL",
    //     menu: "Open Till",
    //     icon: "open_in_browser",
    //     action: Maestro.Order.OpenDrawer
    // },
    {
        path: "/printer",
        name: "Printer",
        menu: "Printers",
        access: "GENERAL",
        icon: "print",
        template: Maestro.Templates.POSPrinterSettings
    },
    {
        path: "/logout",
        name: "Logout",
        menu: "Logout",
        access: "GENERAL",
        icon: "exit_to_app",
        action: Maestro.Users.logoutUser
    },
    {
        path: "/appInfo",
        name: "AppInfo",
        access: "GENERAL",
        template: Maestro.Templates.AppInfo,
    },
    {
        path: "/products",
        name: "Products",
        menu: "Products",
        access: "ADMIN",
        icon: "view_module",
        template: Maestro.Templates.ManageProductsHome,
        subroutes: [
            {
                path: "/create",
                name: "CreateProduct",
                template: Maestro.Templates.CreateProduct
            },
            {
                path: "/sizes",
                name: "ProductSizes",
                // menu: "Sizes",
                template: Maestro.Templates.ManageProductsHome
            },
            {
                path: "/categories",
                name: "ProductCategories",
                // menu: "Categories",
                template: Maestro.Templates.ManageProductsHome
            },
            {
                path: "/addons",
                name: "ManageAddons",
                // menu: "Add-Ons",
                template: Maestro.Templates.ManageProductsHome
            }
        ]
    },    
    {
        path: "/loyaltyPrograms",
        name: "ListLoyaltyPrograms",
        menu: "Loyalty",
        access: "ADMIN",
        icon: "card_giftcard",
        template: Maestro.Templates.ListLoyaltyPrograms,
        subroutes: [
                {
                path: "/create",
                name: "CreateLoyaltyProgram",
                template: Maestro.Templates.CreateLoyaltyProgram
                }
            ]
    },
    {
        path: "/customers",
        name: "ListCustomers",
        menu: "Customers",
        access: "ADMIN",
        icon: "people_outline",
        template: Maestro.Templates.ListCustomers,
        subroutes: [
            {
                path: "/add",
                name: "CreateCustomer",
                template: Maestro.Templates.CreateCustomer
            }
        ]
    },
    {
        path: "/business/employees",
        name: "ListEmployees",
        menu: "Employees",
        access: "ADMIN",
        icon: "people",
        template: Maestro.Templates.ListEmployees,
        subroutes: [
            {
                path: "/create",
                name: "CreateEmployee",
                template: Maestro.Templates.CreateEmployee
            },
            {
                path: "/hoursCalendar",
                name: "HoursCalendar",
                menu: "Hours",
                template: Maestro.Templates.HoursCalendar
            },
            {
                path: "/hoursSummary",
                name: "Hours Summary",
                menu: "Summary",
                template: Maestro.Templates.HoursSummary
            },
            {
                path: "/setupReminders",
                name: "SetupRemindersEmployees",
                menu: "Reminders",
                template: Maestro.Templates.SetupRemindersEmployees
            },
            {
                path: "/setPayrollInfo",
                name: "SetPayrollInfo",
                Menu: "Payroll Settings",
                template: Maestro.Templates.SetPayrollInfo
            },
        ]
    },
    {
        path: "/expenses",
        name: "ListExpenses",
        menu: "Expenses",
        access: "ADMIN",
        icon: "event_note",
        template: Maestro.Templates.ListExpenses
    },
    {
        path: "/orders/floorlayout",
        name: "FloorLayout",
        menu: "Floor Layout",
        access: "ADMIN",
        icon: "group_work",
        template: Maestro.Templates.LayoutEditor
    },
    // {
    //     path: "/accounting",
    //     name: "Accounting",
    //     menu: "Accounting Data",
    //     access: "ADMIN",
    //     icon: "cloud_download",
    //     template: Maestro.Templates.AccountingMain,
    // },
    {
        path: "/settings",
        name: "Settings",
        menu: "Settings",
        access: "ADMIN",
        icon: "settings",
        template: Maestro.Templates.SettingsHome
    },
    {
        path: "/account",
        name: "Account",
        menu: "Account",
        access: "ADMIN",
        icon: "account_box",
        template: Maestro.Templates.AccountInfo       
    },
    {
        path: "/users",
        name: "Users",
        menu: "Users",
        access: "ADMIN",
        icon: "supervisor_account",
        template: Maestro.Templates.BusinessUsersHome,
        subroutes: [
            {
                path: "/add",
                name: "AddUser",
                template: Maestro.Templates.AddBusinessUser
            },
            {
                path: "/edit",
                name: "EditUser",
                template: Maestro.Templates.EditUserDetails
            }
        ]
    },
    {
        path: "/locations",
        name: "ListLocations",
        menu: "Locations",
        access: "ADMIN",
        icon: "location_on",
        template: Maestro.Templates.ListLocations,
        subroutes: [
            {
                path: "/add",
                name: "AddLocation",
                template: Maestro.Templates.AddLocation
            },
            {
                path: "/edit",
                name: "EditLocation",
                template: Maestro.Templates.EditLocation
            },
        ]
    },
    {
    //     path: "/business",
    //     name: "Business",
    //     // menu: "Business",
    //     action: Maestro.Client.goToUserHome,
    // },
        path: "/business",
        name: "Business",
        menu: "Dashboard",
        access: "ADMIN",
        icon: "trending_up",
        template: Maestro.Templates.BusinessDashboard,
    },
];

// Maestro.Client.AllRoutes_ = [
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
    {
        path: "/signup",
        name: "Signup",
        // menu: "Sign Up",
        template: Maestro.Templates.CreateNewAccount
    },
    {
        path: "/login",
        name: "Login",
        // menu: "Login",
        template: Maestro.Templates.Login
    },
    {
        path: "/waiterLogin",
        name: "WaiterLogin",
        template: Maestro.Templates.WaiterLogin
    },
    // {
    //     path: "/admin",
    //     name: "Admin",
    //     template: Maestro.Templates.AdminDashboard
    // },
    {
        path: "/selectBusiness",
        name: "SelectBusiness",
        template: Maestro.Templates.ListBusinesses 
    },
    {
        path: "/appInfo",
        name: "AppInfo",
        template: Maestro.Templates.AppInfo
    },
    // {
    //     path: "/openTill",
    //     name: "Till",
    //     group: "Business",
    //     menu: "Open Till",
    //     icon: "open_in_browser",
    //     action: Maestro.Order.OpenDrawer
    // },
    {
        path: "/business",
        name: "Business",
        menu: "Dashboard",
        group: "Business",
        icon: "trending_up",
        template: Maestro.Templates.BusinessDashboard,
        subroutes: [
            {
                path: "/expenses",
                name: "ListExpenses",
                menu: "Expenses",
                group: "Business",
                icon: "event_note",
                template: Maestro.Templates.ListExpenses,
                subroutes: [
                    {
                        path: "/create",
                        name: "CreateExpense",
                        template: Maestro.Templates.CreateExpense
                    }
                ]
            },
            {
                path: "/employees",
                name: "ListEmployees",
                menu: "Employees",
                group: "Business",
                icon: "people",
                template: Maestro.Templates.ListEmployees,
                subroutes: [
                    {
                        path: "/create",
                        name: "CreateEmployee",
                        template: Maestro.Templates.CreateEmployee
                    },
                    {
                        path: "/hoursCalendar",
                        name: "HoursCalendar",
                        menu: "Hours",
                        template: Maestro.Templates.HoursCalendar
                    },
                    {
                        path: "/hoursSummary",
                        name: "Hours Summary",
                        menu: "Summary",
                        template: Maestro.Templates.HoursSummary
                    },
                    {
                        path: "/setupReminders",
                        name: "SetupRemindersEmployees",
                        menu: "Reminders",
                        template: Maestro.Templates.SetupRemindersEmployees
                    },
                    {
                        path: "/setPayrollInfo",
                        name: "SetPayrollInfo",
                        Menu: "Payroll Settings",
                        template: Maestro.Templates.SetPayrollInfo
                    },
                    {
                        path: "/enterEmployeeHours",
                        name: "EnterEmployeeHours",
                        Menu: "Enter Employee Hours",
                        template: Maestro.Templates.EnterEmployeeHours
                    }
                ]
            },
            {
                path: "/customers",
                name: "ListCustomers",
                menu: "Customers",
                group: "Customers",
                icon: "people_outline",
                template: Maestro.Templates.ListCustomers,
                subroutes: [
                    {
                        path: "/add",
                        name: "CreateCustomer",
                        template: Maestro.Templates.CreateCustomer
                    }
                ]
            },
            {
                path: "/locations",
                name: "ListLocations",
                menu: "Locations",
                group: "Business",
                icon: "location_on",
                template: Maestro.Templates.ListLocations,
                subroutes: [
                    {
                        path: "/add",
                        name: "AddLocation",
                        template: Maestro.Templates.AddLocation
                    },
                    {
                        path: "/edit",
                        name: "EditLocation",
                        template: Maestro.Templates.EditLocation
                    },
                ]
            },
            // {
            //     path: "/printer",
            //     name: "Printer",
            //     menu: "Printer Settings",
            //     icon: "print",
            //     template: Maestro.Templates.POSPrinterSettings
            // },
            {
                path: "/users",
                name: "Users",
                menu: "Users",
                group: "Settings",
                icon: "supervisor_account",
                template: Maestro.Templates.BusinessUsersHome,
                subroutes: [
                    {
                        path: "/add",
                        name: "AddUser",
                        template: Maestro.Templates.AddBusinessUser
                    },
                    {
                        path: "/edit",
                        name: "EditUser",
                        template: Maestro.Templates.EditUserDetails
                    }
                ]
            },
            // {
            //     path: "/accounting",
            //     name: "BusinessAccounts",
            //     menu: "Accounts",
            //     template: Maestro.Templates.BusinessAccountsDashboard
            // },
            // {
            //     path: "/configuration",
            //     name: "BusinessConfiguration",
            //     menu: "Configuration",
            //     template: Maestro.Templates.BusinessConfiguration
            // }
        ]
    },
    {
        path: "/accounting",
        name: "Accounting",
        menu: "Accounting Data",
        group: "Business",
        icon: "cloud_download",
        template: Maestro.Templates.AccountingMain,
    },
    {
        path: "/products",
        name: "Products",
        menu: "Products",
        group: "Products",
        icon: "view_module",
        template: Maestro.Templates.ManageProductsHome,
        subroutes: [
            {
                path: "/create",
                name: "CreateProduct",
                template: Maestro.Templates.CreateProduct
            },
            {
                path: "/sizes",
                name: "ProductSizes",
                // menu: "Sizes",
                template: Maestro.Templates.ManageProductsHome
            },
            {
                path: "/categories",
                name: "ProductCategories",
                // menu: "Categories",
                template: Maestro.Templates.ManageProductsHome
            },
            {
                path: "/addons",
                name: "ManageAddons",
                // menu: "Add-Ons",
                template: Maestro.Templates.ManageProductsHome
            }
        ]
    },
    {
        path: "/loyaltyPrograms",
        name: "ListLoyaltyPrograms",
        menu: "Loyalty",
        group: "Customers",
        icon: "card_giftcard",
        template: Maestro.Templates.ListLoyaltyPrograms,
        subroutes: [
                {
                path: "/create",
                name: "CreateLoyaltyProgram",
                template: Maestro.Templates.CreateLoyaltyProgram
                }
            ]
    },
    {
        path: "/orders",
        name: "Orders",
        menu: "Orders",
        group: "POS",
        icon: "add_shopping_cart",
        template: Maestro.Templates.OrdersHome,
        subroutes: [
            {
                path: "/history",
                name: "OrderHistory",
                menu: "History",
                group: "POS",
                icon: "history",
                template: Maestro.Templates.OrderHistory,
                subroutes: [
                    {
                        path: "/select/:orderId",
                        name: "ViewOrderHistory",
                        // menu: "History",
                        template: Maestro.Templates.OrderHistory,
                    },
                ]
            },
            {
                path: "/openOrders",
                name: "OpenOrders",
                menu: "Open Orders",
                group: "POS",
                icon: "content_paste",
                template: Maestro.Templates.OpenOrders,
                subroutes: [
                            {
                                path: "/select/:orderId",
                                name: "ViewOpenOrders",
                                template: Maestro.Templates.OpenOrders,
                            },
                        ]
            },
            {
                path: "/reports",
                name: "Reports",
                menu: "Reports",
                group: "POS",
                icon: "description",
                template: Maestro.Templates.ReportsHome
            },
            {
                path: "/edit/:orderId/:checkoutMode",
                name: "EditOrder",
                template: Maestro.Templates.OrdersHome
            },
            {
                path: "/floorlayout",
                name: "FloorLayout",
                group: "POS",
                menu: "Floor Layout",
                icon: "group_work",
                template: Maestro.Templates.LayoutEditor
            },

        ]
    },
    {
        path: "/ex",
        name: "External",
        template: Maestro.Templates.External,
        subroutes: [
            {
                path: "/enterHours",
                name: "EnterHours",
                template: Maestro.Templates.EnterHours
            }
        ]
    },
    {
        path: "/notebook",
        name: "Notes",
        menu: "Notes",
        group: "Tools",
        icon: "library_books",
        template: Maestro.Templates.NoteBook,
        subroutes: [
            {
                path: "/createNote",
                name: "createNote",
                template: Maestro.Templates.CreateNote
            }
        ]
    },
    {
        path: "/help",
        name:"HelpAndFeedback",
        menu: "Help",
        group: "Support",
        icon: "help_outline",
        template: Maestro.Templates.GeneralHelp,
        subroutes: [
            {
                path: "/suggestImprovements",
                name: "SuggestImprovements",
                template: Maestro.Templates.SuggestImprovements
            }
        ]
    },
    {
        path: "/settings",
        name: "Settings",
        menu: "Settings",
        group: "Settings",
        icon: "settings",
        template: Maestro.Templates.SettingsHome
    },
    {
        path: "/account",
        name: "Account",
        menu: "Account",
        group: "Settings",
        icon: "account_box",
        template: Maestro.Templates.AccountInfo       
    },
    {
        path: "/logout",
        name: "Logout",
        menu: "Logout",
        group: "Logout",
        icon: "exit_to_app",
        action: Maestro.Users.logoutUser
    },
];

