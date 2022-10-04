Maestro.Templates.ListLoyaltyPrograms = "ListLoyaltyPrograms";

var selectedProgramId = new ReactiveVar();

var editMode = new ReactiveVar();
var editProgram = {};

var addNewProductsMode = new ReactiveVar();
var addNewCategoriesMode = new ReactiveVar();

var selectedGroup = new ReactiveVar();
var selectedProduct = new ReactiveVar();

Template.ListLoyaltyPrograms.onCreated(function(){
    let template = this;

    template.filterProgramType = new ReactiveVar();
    template.filterProgramType.set("All");
});

Template.ListLoyaltyPrograms.onRendered(function(){
    let template = this;
    editMode.set(false);

    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15 // Creates a dropdown of 15 years to control year
    });

    template.filterProgramType.set("All");
});

Template.ListLoyaltyPrograms.helpers({
    getQuantityPrograms: function(){
        let filterType = Template.instance().filterProgramType.get();
        if (filterType == "All" || filterType == "Quantity"){
            return Maestro.Loyalty.GetQuantityBasedLoyaltyPrograms();
        }
    },

    getAmountPrograms: function(){
        let filterType = Template.instance().filterProgramType.get();
        if (filterType == "All" || filterType == "Amount"){
            return Maestro.Loyalty.GetAmountBasedLoyaltyPrograms();
        }
    },


    getPercentagePrograms: function(){
        let filterType = Template.instance().filterProgramType.get();
        if (filterType == "All" || filterType == "Percentage"){
            return Maestro.Loyalty.GetPercentageBasedLoyaltyPrograms();
        }
    },


    getTallyPrograms: function(){
        let filterType = Template.instance().filterProgramType.get();
        if (filterType == "All" || filterType == "Tally"){
            return Maestro.Loyalty.GetTallyBasedLoyaltyPrograms();
        }
    },

    getProgramActiveCards: function(programId){
        return Maestro.LoyaltyCards.getProgramActiveCards(programId);
    },

    getProgramExpiredCards: function(programId){
        return Maestro.LoyaltyCards.getProgramExpiredCards(programId);
    },

    isProgramTypeFilterSelected: function(type){
        if(type == Template.instance().filterProgramType.get()){
            return true;
        } 
        return false;
    },

    isSelectedProgram: function(programId){
        let chosenProgramId = selectedProgramId.get();
        if (chosenProgramId){
            if (programId == chosenProgramId){
                return 'background-color:lightblue;'
            } else {
                return;
            }
        } else {return;}
    },

    getProgramTypeIcon: function(programType){
        if(programType.type == "Quantity"){
            return "#";
        } else if(programType.type == "Percentage"){
            return "%";
        } if(programType.type == "Amount"){
            return "$";
        } if(programType.type == "Tally"){
            return "|||";
        }
    },

    getProgramTaxRule: function(taxRule){
        if (taxRule){
            if (taxRule == "RETAIL_TAX"){
                return "Retail Tax Applies";
            } else if (taxRule == "NOT_TAXED"){
                return "Not Taxed";
            }
        } else {
            return "Retail Tax Applies";
        }
    },

    inEditMode: function(){
        return editMode.get();
    },

    listPrograms: function(){
        return LoyaltyPrograms.find({});
    },

    getSelectedProgram: function(){
        // console.log(LoyaltyPrograms.findOne({_id: selectedProgramId.get()}));
        return LoyaltyPrograms.findOne({_id: selectedProgramId.get()});
    },

    getProductName: function(productId){
    	nameObj = _.pluck(Products.find({_id: productId},{fields: {name:1}}).fetch(), 'name');
    	return nameObj[0];
    },
    getSizeLabels: function(sizeCodes){
        var labels = "";

        for (i=0; i<sizeCodes.length; i++){
            labels += Maestro.Client.getProductSizeName(sizeCodes[i]);
            if (i<(sizeCodes.length-1)){
                labels += ", ";
            }
        }

        return labels;
    },

    getPriceInfo: function(price){
    	if (price){
    		return "Price: $" + price.toFixed(2);
    	} else if (!price){
    		return "Free coupon / reward";
    	}
    },

    getExpiryDays: function(expiry){
    	if (expiry){
    		return "Expires " + expiry + " days after purchase";
    	} 
    },

    getExpiryDate: function(expiry){
        if (expiry > new Date(1969, 12, 31)){
            return "Expires on "+expiry.toDateString()+".";
        }
    },

    getProgramTypeInfo: function(program, appliesTo){
        var type = program.type;
        if(type=="Quantity"){
            return "Redeem "+program.quantity+" of any of the selected items below";
        } else if (type=="Percentage"){
            if(appliesTo == "Categories"){
                return "Discount of "+program.creditPercentage+"% on selected categories";
            } else if (appliesTo == "Entire-Purchase"){
                return "Discount of "+program.creditPercentage+"% on entire purchase";
            }
        } else if (type=="Amount"){
            return "Redeem a monetary value of $"+program.creditAmount;
        } else if (type=="Tally"){
            return "Buy "+program.tally+", and Get Next 1 Free";
        }
    },

    editExpiryDays:function(expiry){
    	if (expiry){
    		return expiry;
    	} else {
    		return;
    	}
    },

    editExpiryDate:function(expiry){
        if (expiry > new Date(1969, 12, 31)){
            return expiry.toDateString();
        } 
    },

    editPrice: function(price){
    	if (price){
    		return price;
    	} else {
    		return;
    	}
    },

    isProgramActive: function(status){
        if (status=="Active"){
            return true;
        } else {
            return false;
        }
    },

    isAddNewProductsMode: function(){
        if(addNewProductsMode.get()){
            return;
        } else {
            return "display: none;";
        }
    },

    isAddNewCategoriesMode: function(){
        if(addNewCategoriesMode.get()){
            return;
        } else {
            return "display: none;";
        }
    },

    // isAddNewProductsMode: function(){
    //     if(addNewProductsMode.get()){
    //         return true;
    //     } else {
    //         return  true;
    //     }
    // },

    // isAddNewCategoriesMode: function(){
    //     if(addNewCategoriesMode.get()){
    //         return true;
    //     } else {
    //         return  true;
    //     }
    // },

    getSortedFilteredProductsAndGroups: function (){
        var findCriteria = {};

        let sortType = "categories";

        findCriteria = {status:'Active'};

        return Maestro.Client.getProductsAndGroups(findCriteria, sortType);
    },

    category: function(){
        return ProductCategories.find({},{sort: {name:1}})
    },

    thisProductAlreadyAdded: function(productId){
        thisProgram = LoyaltyPrograms.findOne({_id: selectedProgramId.get()});
        programProductIds = _.pluck(thisProgram.products, 'productId');
        return _.contains(programProductIds, productId);
    },

    thisCategoryAlreadyAdded: function(categoryName){
        thisProgram = LoyaltyPrograms.findOne({_id: selectedProgramId.get()});
        programCategoryNames = _.pluck(thisProgram.categories, 'name');
        return _.contains(programCategoryNames, categoryName);
    },

    isThisSelectedGroup: function(name){
        let chosenGroup = selectedGroup.get();
        if (chosenGroup){
            let chosenGroupName = chosenGroup.name;
            if (name == chosenGroupName){
                return true;
            } 
        }
        return false;
    },

    isThisSelectedProduct: function(productId){
        let chosenProduct = selectedProduct.get();
        if(chosenProduct){
            if(chosenProduct._id == productId){
                return true;
            }
        }
        return false;
    },

    getSizes: function(productId){
        var productsObj = Products.find({_id: productId}).fetch();

        var productSizesObj = productsObj[0].sizes;
        var productSizeCodes = _.pluck(productSizesObj, 'code');
        var productSizeLabels = [];
        var productSizePrices = _.pluck(productSizesObj, 'price');

        var productSizes = [];

        for (i=0; i<productSizeCodes.length; i++){
            productSizes.push({
                code: productSizeCodes[i],
                label: Maestro.Client.getProductSizeName(productSizeCodes[i]),
                price: productSizePrices[i]
            });
        }

        return productSizes;
    },

    // isProductsCategoriesEditable: function(programType, appliesTo){
    //     if(programType){
    //         if(programType.type == "Quantity" || 
    //             (programType.type == "Percentage" && appliesTo != "Entire-Purchase") || 
    //             programType.type == "Tally"){
    //             return;
    //         }
    //     }
    //     return "display: none;";   
    // },

    isProductsCategoriesEditable: function(programType, appliesTo){
        if(programType){
            if(programType.type == "Quantity" || 
                (programType.type == "Percentage" && appliesTo != "Entire-Purchase") || 
                programType.type == "Tally"){
                return true;
            }
        }
        return false;   
    },

    getCustomerName: function(customerId){
        return Maestro.Customers.GetName(customerId);
    },

    getLoyaltyBalance: function(remainingQuantity, remainingAmount){
        if(remainingAmount){
            return "Balance $"+ remainingAmount.toFixed(2);
        } else if (remainingQuantity){
            return "Balance of "+remainingQuantity+" items";
        }
    },

    getArrayCount: function(arrayObj){
        return (arrayObj || []).length;
    },

    getProgramItemsCount: function(arrayObj1 = [], arrayObj2 = []){
        return arrayObj1.length + arrayObj2.length;
    },

    getLoyaltyExpiration: function(programId, boughtOn){
        let purchasedOn= new Date();
        purchasedOn.setHours(0);
        purchasedOn.setMinutes(0);
        purchasedOn.setSeconds(0);
        purchasedOn.setMilliseconds(1);

        let todayDate = new Date();
        todayDate.setHours(23);
        todayDate.setMinutes(59);
        todayDate.setSeconds(59);
        todayDate.setMilliseconds(999);

        let loyaltyProgram = LoyaltyPrograms.findOne({_id: programId});

        if(loyaltyProgram.expiryDays){
            let remainingDays = loyaltyProgram.expiryDays - ((todayDate.valueOf() - purchasedOn.valueOf())/(1000*60*60*24)).toFixed(0);
            if (remainingDays < 0 ){
                return "Program Expired";
            } else {
                return remainingDays + " days left till expiry";
            }
        } else if (loyaltyProgram.expiryDate){
            if (todayDate>loyaltyProgram.expiryDate){
                return "Program Expired";
            } else {
                return "Expires on " + loyaltyProgram.expiryDate.toDateString();
            }
        }
    },

    isProgramNonPercent: function(programId){
        let program = LoyaltyPrograms.findOne({_id: programId});
        let type = program.programType.type;
        if(type != "Percentage"){
            return true;
        }

        return false;
    },

    getLoyaltyBalanceAmount: function(remainingQuantity, remainingAmount, tally){
        return remainingQuantity || remainingAmount || tally;
    },

    isTallyProgramType: function(programType){
        if(programType == "Tally"){
            return true;
        }
        return false;
    }

});

Template.ListLoyaltyPrograms.events({
    'click .filterProgramType': function(event, template){
        template.filterProgramType.set( $(event.target).data("programtype"));  
    },

    'click .programSelected': function(event, template){
        editMode.set(false);
        editProgram = {};
        let programId = this._id;
        selectedProgramId.set(programId);
        addNewProductsMode.set(false);
        addNewCategoriesMode.set(false);
    },

	'click .editThisCard':function(event, template){
        editMode.set(true);

        var programId = selectedProgramId.get();

        editProgram = {};

        editProgram = LoyaltyPrograms.findOne({_id: programId});

        $('.datepicker').pickadate({
            selectMonths: true, // Creates a dropdown to control month
            selectYears: 15 // Creates a dropdown of 15 years to control year
        });
	},

	'click .clearChangesOnCard': function(event, template){
        editMode.set(false);

        editProgram = {};
	},

	'click .saveThisCard': function(event, template){
        var programId = selectedProgramId.get();

        delete editProgram._id;

        editProgram.name = document.getElementById('editProgramNameField').value;
        editProgram.price = Number(document.getElementById('editProgramPriceField').value);
        editProgram.expiryDays = Number(document.getElementById('editProgramExpiryDays').value);
        
        if(document.getElementById('editProgramExpiryDate').value){
            editProgram.expiryDate = new Date(document.getElementById('editProgramExpiryDate').value);
        }

        // if(document.getElementById('editProgramStatus').checked){
        //     editProgram.status = "Active";
        // } else {
        //     editProgram.status = "Disabled";
        // }

        if (document.getElementById('yesTax').checked){
            editProgram.taxRule = Maestro.Tax.Types.RETAIL_TAX.key;
        } else if (document.getElementById('noTax').checked){
            editProgram.taxRule = Maestro.Tax.Types.NOT_TAXED.key;
        }

        Meteor.call("editLoyaltyProgram", programId, editProgram, function(error, result) {
            if(error) {
                console.log(error);
            } else {
                Materialize.toast("Modified loyalty program", 1000);

                editProgram = {};
            }
        });

        editMode.set(false);
	},

    'click .deactivateProgram': function(event, template){
        thisProgram = LoyaltyPrograms.findOne({_id: selectedProgramId.get()});
        thisCategory = this;
        thisProgramId = thisProgram._id;

        delete thisProgram._id;

        thisProgram.status = "Disabled";

        // console.log(thisProgram);

        Meteor.call('editLoyaltyProgram', thisProgramId, thisProgram , function(error, result){
            if(error){
                console.log(error);
            } else {
                Materialize.toast("Deactivated Program", 1000);
            }
        });
    },

    'click .activateProgram': function(event, template){
        thisProgram = LoyaltyPrograms.findOne({_id: selectedProgramId.get()});
        thisCategory = this;
        thisProgramId = thisProgram._id;

        delete thisProgram._id;

        thisProgram.status = "Active";

        // console.log(thisProgram);

        Meteor.call('editLoyaltyProgram', thisProgramId, thisProgram , function(error, result){
            if(error){
                console.log(error);
            } else {
                Materialize.toast("Activated Program", 1000);
            }
        });
    },

    'click .removeThisProduct': function(event, template){
        // console.log(this);
        thisProgram = LoyaltyPrograms.findOne({_id: selectedProgramId.get()});
        thisProduct = this;
        thisProgramId = thisProgram._id;

        delete thisProgram._id;

        thisProgram.products = _.filter(thisProgram.products, function(prod){
            return prod.productId != thisProduct.productId;
        });

        // console.log(thisProgram);

        Meteor.call('editLoyaltyProgram', thisProgramId, thisProgram , function(error, result){
            if(error){
                console.log(error);
            } else {
                Materialize.toast("Removed Product", 1000);
            }
        });

    },

    'click .removeThisCategory': function(event, template){
        // console.log(this);
        thisProgram = LoyaltyPrograms.findOne({_id: selectedProgramId.get()});
        thisCategory = this;
        thisProgramId = thisProgram._id;

        delete thisProgram._id;

        thisProgram.categories = _.filter(thisProgram.categories, function(catg){
            return catg.name != thisCategory.name;
        });

        // console.log(thisProgram);

        Meteor.call('editLoyaltyProgram', thisProgramId, thisProgram , function(error, result){
            if(error){
                console.log(error);
            } else {
                Materialize.toast("Removed Category", 1000);
            }
        });
    },

    'click .addNewItem': function(event, template){
        // console.log(this);
        thisProgram = LoyaltyPrograms.findOne({_id: selectedProgramId.get()});

        if(thisProgram.appliesTo == "Products"){
            addNewProductsMode.set(true);
            addNewCategoriesMode.set(false);
        } else if (thisProgram.appliesTo == "Categories"){
            addNewProductsMode.set(false);
            addNewCategoriesMode.set(true);
        }

    },    

    'click .exitAddNewItemMode': function(event, template){
        addNewProductsMode.set(false);
        addNewCategoriesMode.set(false);
    },

    'click .selectProduct': function(event, template){
        // console.log(this);
        selectedProduct.set(this);
    },

    'click .addSelectedProduct': function(event, template){
        thisProgram = LoyaltyPrograms.findOne({_id: selectedProgramId.get()});
        thisProduct = selectedProduct.get();
        thisProgramId = thisProgram._id;

        delete thisProgram._id;

        productSizesObj = thisProduct.sizes;
        productSizeCodes = _.pluck(productSizesObj, 'code');
        sizes = [];

        for (j=0; j<productSizeCodes.length; j++){
            if(document.getElementById(productSizeCodes[j]).checked){
                sizes.push(productSizeCodes[j]);
            }
        }

        if(!sizes.length){
            Materialize.toast('Select at least one product size',3000);
            return;
        }

        thisProgram.products.push({
            productId: thisProduct._id,
            sizeCodes: sizes
        });

        console.log(thisProgram);

        Meteor.call('editLoyaltyProgram', thisProgramId, thisProgram , function(error, result){
            if(error){
                console.log(error);
            } else {
                Materialize.toast("Added Product", 1000);
                selectedProduct.set();
            }
        });
    },
    
    'click .selectCategory': function(event, template){
        // console.log(this);
        thisProgram = LoyaltyPrograms.findOne({_id: selectedProgramId.get()});
        thisCategory = this;
        thisProgramId = thisProgram._id;

        delete thisProgram._id;

        thisProgram.categories.push({name: thisCategory.name});

        console.log(thisProgram);

        Meteor.call('editLoyaltyProgram', thisProgramId, thisProgram , function(error, result){
            if(error){
                console.log(error);
            } else {
                Materialize.toast("Added Category", 1000);
            }
        });
    },

    'click .selectGroup': function(event, template){
        selectedGroup.set(this);
        selectedProduct.set();
    },

    'click .deselectGroup': function(event, template){
        selectedGroup.set();
    },

    'click .updateBalanceForProgram': function(event, template){
        let updateCard = this;
        let updateBalance = Number(document.getElementById('updateBalancefor-' + updateCard._id).value);
        
        if(updateBalance < 0){
            Materialize.toast("Balance can not be less than or equal to 0", 1500, 'red');
            return;
        }
        if(!updateBalance) {return;}

        Maestro.LoyaltyCards.UpdateCardBalance(updateCard, updateBalance);
    },

    'click .deactivateProgramCard': function(event, template){
        let updateCard = this;
        let updateBalance = Number((document.getElementById('updateBalancefor-' + updateCard._id) || {}).value);

        Maestro.LoyaltyCards.UpdateCardBalance(updateCard, updateBalance, expired = true);
    },

    'click .reactivateProgramCard': function(event, template){
        let updateCard = this;
        let balanceField = document.getElementById('reactivate-' + updateCard._id);
        let updateBalance;

        if(!!balanceField){
            updateBalance = Number(balanceField.value);

            if(updateBalance <= 0){
                Materialize.toast("Balance can not be less than or equal to 0", 1500, 'red');
                return;
            }
        }        

        Maestro.LoyaltyCards.UpdateCardBalance(updateCard, updateBalance, expired = false);
    },

    'click .expandProgramActiveCards': function(event, template){
        var container = document.getElementById('programActiveCards');
        $('#expandProgramActiveCards').toggleClass('rotateUp');
        var icon = document.getElementById('programActiveCards');
        if (container.style.display === 'none') {
            container.style.display = 'block';
        } else {
            container.style.display = 'none';
        }
    },

    'click .expandProgramExpiredCards': function(event, template){
        var container = document.getElementById('programExpiredCards');
        $('#expandProgramExpiredCards').toggleClass('rotateUp');
        if (container.style.display === 'none') {
            container.style.display = 'block';
        } else {
            container.style.display = 'none';
        }
    },

    'click .expandProgramItems': function(event, template){
        var container = document.getElementById('programItems');
        $('#expandProgramItems').toggleClass('rotateUp');
        if (container.style.display === 'none') {
            container.style.display = 'block';
        } else {
            container.style.display = 'none';
        }
    },
});