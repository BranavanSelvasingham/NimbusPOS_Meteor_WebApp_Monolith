LoyaltyPrograms = new Mongo.Collection("loyalty-programs");

Maestro.Schemas.ProgramProduct = new SimpleSchema({
    productId:{
        type: String
    },    
    sizeCodes:{
        type: [String]
    }
});

Maestro.Schemas.ProgramTypes = new SimpleSchema({
    type: { //Quantity, Percentage, Amount, Tally
        type: String
    },
    quantity:{
        type: Number,
        optional: true
    },
    creditPercentage:{
        type: Number,
        optional: true
    },
    creditAmount:{
        type: Number,
        decimal: true,
        optional: true
    },
    tally: {
        type: Number,//the number after which the next 1 is free
        optional: true
    }
});

Maestro.Schemas.ProgramCategories = new SimpleSchema({
    name: {
        type: String
    }
});

Maestro.Schemas.LoyaltyProgram = new SimpleSchema({
    name: {
        type: String,
        optional: true
    },
    programType: {
        type: Maestro.Schemas.ProgramTypes,
        optional: true
    },
    appliesTo: {
        type: String, //"Products, Categories, Entire-Purchase"
        optional: true
    },
    products: {
        type: [Maestro.Schemas.ProgramProduct],
        optional: true
    },
    categories:{
        type: [Maestro.Schemas.ProgramCategories],
        optional: true
    },
    price: {
        type: Number,
        optional: true,
        decimal: true,
        defaultValue: 0.00,
    },
    expiryDays:{
        type: Number,
        optional: true
    },
    expiryDate: {
        type: Date,
        optional: true
    },
    status: {
        type: String, //will be either Active or Disabled
        defaultValue: 'Active',
        optional: true
    },
    businessId: {
        type: String,
        optional: true
    },
    taxRule: {
        type: String,
        optional: true,
        allowedValues: Maestro.Tax.Types.keys(),
        defaultValue: Maestro.Tax.Types.RETAIL_TAX.key
    },
    purchaseLoyalty: {
        type: Maestro.Schemas.Product,
        optional: true,
        autoValue: function(){
            var product;
            let maestroSizeSet = Maestro.Products.Sizes;

            product = {
                name: this.field('name').value,
                status: this.field('status').value,
                businessId: this.field('businessId').value,
                categories: ["_Loyalty_Programs"],
                sizes: [{code: maestroSizeSet[0].code, price:this.field('price').value}],
                taxRule: this.field('taxRule').value,
                updatedBy: this.userId,
                updatedAt: new Date
            };
            return product;
        }
    }
});

LoyaltyPrograms.attachSchema(Maestro.Schemas.LoyaltyProgram);

LoyaltyPrograms.allow({ 
    insert() { return true; }, 
    update() { return true; }, 
    remove() { return true; } 
}); 

LoyaltyPrograms.deny({ 
    insert() { return false; }, 
    update() { return false; }, 
    remove() { return false; } 
});
