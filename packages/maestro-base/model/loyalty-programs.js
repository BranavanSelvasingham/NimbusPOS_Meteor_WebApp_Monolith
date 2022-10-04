// LoyaltyPrograms = new Mongo.Collection("loyalty-programs");

// Maestro.Schemas.ProgramProduct = new SimpleSchema({
//     productId:{
//         type: String
//     },    
//     sizeCodes:{
//         type: [String]
//     }
// });

// Maestro.Schemas.ProgramTypes = new SimpleSchema({
//     type: { //Quantity, Percentage, Amount
//         type: String
//     },
//     quantity:{
//         type: Number,
//         optional: true
//     },
//     creditPercentage:{
//         type: Number,
//         optional: true
//     },
//     creditAmount:{
//         type: Number,
//         decimal: true,
//         optional: true
//     }
// });

// Maestro.Schemas.ProgramCategories = new SimpleSchema({
//     name: {
//         type: String
//     }
// });

// Maestro.Schemas.LoyaltyProgram = new SimpleSchema({
//     name: {
//         type: String
//     },
//     programType: {
//         type: Maestro.Schemas.ProgramTypes
//     },
//     appliesTo: {
//         type: String,
//         optional: true
//     },
//     products: {
//         type: [Maestro.Schemas.ProgramProduct],
//         optional: true
//     },
//     categories:{
//         type: [Maestro.Schemas.ProgramCategories],
//         optional: true
//     },
//     price: {
//         type: Number,
//         decimal: true,
//         defaultValue: 0.00
//     },
//     expiryDays:{
//         type: Number,
//         optional: true
//     },
//     expiryDate: {
//         type: Date,
//         optional: true
//     },
//     status: {
//         type: String, //will be either Active or Disabled
//         defaultValue: 'Active'
//     },
//     businessId: {
//         type: String
//     },
//     taxRule: {
//         type: String,
//         optional: true,
//         allowedValues: Maestro.Tax.Types.keys(),
//         defaultValue: Maestro.Tax.Types.RETAIL_TAX.key
//     },

//     purchaseLoyalty: {
//         type: Maestro.Schemas.Product,
//         optional: true,
//         autoValue: function(){
//             var product;
//             let maestroSizeSet = Maestro.Products.Sizes;

//             product = {
//                 name: this.field('name').value,
//                 status: this.field('status').value,
//                 businessId: this.field('businessId').value,
//                 categories: ["_Loyalty_Programs"],
//                 sizes: [{code: maestroSizeSet[0].code, price:this.field('price').value}],
//                 taxRule: this.field('taxRule').value,
//                 updatedBy: this.userId,
//                 updatedAt: new Date
//             };
//             return product;
//         }
//     },

//     createdBy: {
//         type: String,
//         optional: true,
//         autoValue: function() {
//             if (this.isInsert) {
//                 return this.userId;
//             } else if (this.isUpsert) {
//                 return {$setOnInsert: this.userId};
//             } else {
//                 this.unset();
//             }
//         }
//     },
//     createdAt: {
//         type: Date,
//         optional: true,
//         autoValue: function() {
//             if (this.isInsert) {
//                 return new Date;
//             } else if (this.isUpsert) {
//                 return {$setOnInsert: new Date};
//             } else {
//                 this.unset();
//             }
//         }
//     },
//     updatedBy: {
//         type: String,
//         optional: true,
//         autoValue: function() {
//             if (this.isUpdate) {
//                 return this.userId;
//             } else if (this.isUpsert) {
//                 return {$setOnUpdate: this.userId};
//             } else {
//                 this.unset();
//             }
//         }
//     },
//     updatedAt: {
//         type: Date,
//         optional: true,
//         autoValue: function() {
//             if (this.isUpdate) {
//                 return new Date;
//             } else if (this.isUpsert) {
//                 return {$setOnUpdate: new Date};
//             } else {
//                 this.unset();
//             }
//         }
//     }
// });

// LoyaltyPrograms.attachSchema(Maestro.Schemas.LoyaltyProgram);