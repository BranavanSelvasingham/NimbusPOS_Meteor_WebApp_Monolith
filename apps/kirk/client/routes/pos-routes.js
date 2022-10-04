// Maestro.Client.PosRoutes = [
//     {
//         path: "/",
//         name: "Root",
//         action: Maestro.Client.goToUserHome
//     },
//     {
//         path: "/home",
//         name: "Home",
//         action: Maestro.Client.goToUserHome
//     },
//     {
//         path: "/login",
//         name: "Login",
//         // menu: "Login",
//         template: Maestro.Templates.Login
//     },
//     {
//         path: "/logout",
//         name: "Logout",
//         action: Maestro.Users.logoutUser
//     },
//     {
//         path: "/business",
//         name: "Business",
//         // menu: "Business",
//         action: Maestro.Client.goToUserHome,
//         subroutes: [
//             {
//                 path: "/employees",
//                 name: "ListEmployees",
//                 // menu: "Employees",
//                 action: Maestro.Client.goToUserHome,
//                 subroutes: [
//                     {
//                         path: "/enterEmployeeHours",
//                         name: "EnterEmployeeHours",
//                         // Menu: "Enter Employee Hours",
//                         template: Maestro.Templates.EnterEmployeeHours
//                     }
//                 ]
//             },
//             {
//                 path: "/expenses",
//                 name: "ListExpenses",
//                 // menu: "Expenses",
//                 action: Maestro.Client.goToUserHome,
//                 subroutes: [
//                     {
//                         path: "/create",
//                         name: "CreateExpense",
//                         template: Maestro.Templates.CreateExpense
//                     }
//                 ]
//             }
//         ]
//     },
//     {
//         path: "/orders",
//         name: "Orders",
//         menu: "Orders",
//         template: Maestro.Templates.OrdersHome,
//         subroutes: [
//             {
//                 path: "/history",
//                 name: "OrderHistory",
//                 menu: "History",
//                 template: Maestro.Templates.OrderHistory
//             }
//         ]
//     },
//     {
//         path: "/help",
//         name:"HelpAndFeedback",
//         menu: "Help",
//         template: Maestro.Templates.GeneralHelp,
//         subroutes: [
//             {
//                 path: "/suggestImprovements",
//                 name: "SuggestImprovements",
//                 menu: "Request Features",
//                 template: Maestro.Templates.SuggestImprovements
//             }
//         ]
//     }
// ];
